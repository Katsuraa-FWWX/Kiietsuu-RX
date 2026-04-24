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

app.get("/api/proxy", async (req, res) => {
  const target = req.query.url ? String(req.query.url) : "";
  if (!/^https?:\/\/[^\s]+\.tikwm\.com\/[^\s]+$/i.test(target)) {
    return res.status(400).send("Invalid proxy target");
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
        Referer: "https://www.tikwm.com/",
      },
    });

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
    const pump = async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    pump().catch((e) => {
      console.error("[/api/proxy] stream err", e);
      if (!res.headersSent) res.status(502);
      res.end();
    });
  } catch (err) {
    console.error("[/api/proxy]", err);
    res.status(502).send("Proxy failed: " + err.message);
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`TikTok downloader listening on http://localhost:${PORT}`);
});
