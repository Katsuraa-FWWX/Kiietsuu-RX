const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const TIKTOK_URL_RE =
  /^https?:\/\/(?:www\.|vm\.|vt\.|m\.)?tiktok\.com\/[^\s]+$/i;

async function resolveTikwm(url) {
  const res = await fetch("https://www.tikwm.com/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
    },
    body: new URLSearchParams({ url, hd: "1" }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Upstream HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json.code !== 0 || !json.data) {
    throw new Error(json.msg || "Failed to resolve TikTok URL");
  }

  const d = json.data;
  const base = "https://www.tikwm.com";
  const abs = (p) =>
    !p ? null : p.startsWith("http") ? p : base + p;

  return {
    id: d.id,
    title: d.title,
    cover: abs(d.cover),
    origin_cover: abs(d.origin_cover),
    duration: d.duration,
    play_count: d.play_count,
    digg_count: d.digg_count,
    comment_count: d.comment_count,
    share_count: d.share_count,
    download_count: d.download_count,
    create_time: d.create_time,
    author: d.author
      ? {
          id: d.author.id,
          unique_id: d.author.unique_id,
          nickname: d.author.nickname,
          avatar: abs(d.author.avatar),
        }
      : null,
    music: abs(d.music),
    music_info: d.music_info
      ? {
          title: d.music_info.title,
          author: d.music_info.author,
          play: abs(d.music_info.play),
        }
      : null,
    video_no_watermark: abs(d.play),
    video_no_watermark_hd: abs(d.hdplay),
    video_watermark: abs(d.wmplay),
    images: Array.isArray(d.images) ? d.images.map(abs) : null,
  };
}

app.post("/api/download", async (req, res) => {
  const url = (req.body && req.body.url ? String(req.body.url) : "").trim();

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in request body." });
  }
  if (!TIKTOK_URL_RE.test(url)) {
    return res.status(400).json({ error: "URL harus berasal dari tiktok.com" });
  }

  try {
    const data = await resolveTikwm(url);
    res.json({ ok: true, data });
  } catch (err) {
    console.error("[/api/download]", err);
    res.status(502).json({
      ok: false,
      error:
        "Gagal mengambil data video. Pastikan link benar dan video bersifat publik.",
      detail: err.message,
    });
  }
});

const PROXY_HOST_ALLOWLIST = [
  /\.tikwm\.com$/i,
  /\.tiktokcdn\.com$/i,
  /\.tiktokcdn-us\.com$/i,
  /\.tiktokcdn-eu\.com$/i,
  /\.tiktokv\.com$/i,
  /\.byteoversea\.com$/i,
  /\.muscdn\.com$/i,
  /\.bytedance\.net$/i,
];

function isAllowedProxyTarget(target) {
  let parsed;
  try {
    parsed = new URL(target);
  } catch (_) {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  return PROXY_HOST_ALLOWLIST.some((re) => re.test(parsed.hostname));
}

app.get("/api/proxy", async (req, res) => {
  const target = req.query.url ? String(req.query.url) : "";
  if (!isAllowedProxyTarget(target)) {
    return res.status(400).send("Invalid proxy target");
  }

  const MAX_HOPS = 5;
  const fetchWithAllowlistedRedirects = async (startUrl) => {
    let current = startUrl;
    for (let hop = 0; hop <= MAX_HOPS; hop++) {
      const r = await fetch(current, {
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
          Referer: "https://www.tikwm.com/",
        },
      });
      if (r.status < 300 || r.status >= 400) return r;
      const loc = r.headers.get("location");
      if (!loc) return r;
      const next = new URL(loc, current).toString();
      if (!isAllowedProxyTarget(next)) {
        const err = new Error(`Redirect blocked to disallowed host: ${next}`);
        err.code = "REDIRECT_BLOCKED";
        throw err;
      }
      current = next;
    }
    const err = new Error("Too many redirects");
    err.code = "TOO_MANY_REDIRECTS";
    throw err;
  };

  try {
    const upstream = await fetchWithAllowlistedRedirects(target);

    if (!upstream.ok || !upstream.body) {
      return res.status(502).send(`Upstream error: ${upstream.status}`);
    }

    const filenameHint =
      (req.query.filename && String(req.query.filename)) ||
      target.split("/").pop().split("?")[0] ||
      "tiktok-download";

    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filenameHint.replace(/[^\w.\-]/g, "_")}"`
    );
    const len = upstream.headers.get("content-length");
    if (len) res.setHeader("Content-Length", len);

    const reader = upstream.body.getReader();
    let cancelled = false;
    const cancelReader = (reason) => {
      if (cancelled) return;
      cancelled = true;
      reader.cancel(reason).catch(() => {});
    };
    req.on("close", () => cancelReader("client disconnected"));
    res.on("error", (e) => cancelReader(e));

    const pump = async () => {
      try {
        while (true) {
          if (res.destroyed || !res.writable) {
            cancelReader("response not writable");
            return;
          }
          const { value, done } = await reader.read();
          if (done) break;
          if (!res.write(Buffer.from(value))) {
            await new Promise((resolve, reject) => {
              const onDrain = () => {
                res.off("error", onErr);
                res.off("close", onClose);
                resolve();
              };
              const onErr = (e) => {
                res.off("drain", onDrain);
                res.off("close", onClose);
                reject(e);
              };
              const onClose = () => {
                res.off("drain", onDrain);
                res.off("error", onErr);
                reject(new Error("client closed"));
              };
              res.once("drain", onDrain);
              res.once("error", onErr);
              res.once("close", onClose);
            });
          }
        }
        res.end();
      } catch (e) {
        cancelReader(e);
        if (!res.headersSent) res.status(502);
        if (!res.writableEnded) res.end();
        throw e;
      }
    };
    pump().catch((e) => {
      console.error("[/api/proxy] stream err", e);
    });
  } catch (err) {
    console.error("[/api/proxy]", err);
    if (err && err.code === "REDIRECT_BLOCKED") {
      return res.status(400).send("Invalid proxy target");
    }
    if (err && err.code === "TOO_MANY_REDIRECTS") {
      return res.status(502).send("Too many redirects");
    }
    res.status(502).send("Proxy failed: " + err.message);
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`TikTok downloader listening on http://localhost:${PORT}`);
});
