const $ = (sel) => document.querySelector(sel);

const form = $("#form");
const urlInput = $("#url");
const submit = $("#submit");
const submitLabel = $("#submit-label");
const errorBox = $("#error");
const errorText = $("#error-text");
const result = $("#result");
const player = $("#player");
const avatar = $("#avatar");
const author = $("#author");
const username = $("#username");
const titleEl = $("#title");
const statPlay = $("#stat-play");
const statLike = $("#stat-like");
const statComment = $("#stat-comment");
const statShare = $("#stat-share");
const dlNowm = $("#dl-nowm");
const dlHd = $("#dl-hd");
const dlWm = $("#dl-wm");
const dlMp3 = $("#dl-mp3");
const imagesWrap = $("#images-wrap");
const imagesEl = $("#images");

function fmt(n) {
  if (n == null) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function proxied(url, filename) {
  if (!url) return null;
  const qs = new URLSearchParams({ url });
  if (filename) qs.set("filename", filename);
  return "/api/proxy?" + qs.toString();
}

function showError(msg) {
  errorText.textContent = msg;
  errorBox.classList.remove("hidden");
  result.classList.add("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

function setLoading(loading) {
  submit.disabled = loading;
  submitLabel.textContent = loading ? "Memproses..." : "Ambil";
}

function setDL(el, href, filename) {
  if (!href) {
    el.classList.add("hidden");
    el.removeAttribute("href");
    el.removeAttribute("download");
    return;
  }
  el.classList.remove("hidden");
  el.href = proxied(href, filename);
  el.setAttribute("download", filename || "");
}

async function fetchInfo(url) {
  const res = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) {
    throw new Error(json.error || "Gagal memproses URL");
  }
  return json.data;
}

function render(data) {
  hideError();
  result.classList.remove("hidden");

  const baseName = `tiktok-${data.id || Date.now()}`;
  const preferred =
    data.video_no_watermark_hd ||
    data.video_no_watermark ||
    data.video_watermark;

  if (preferred) {
    player.src = proxied(preferred, `${baseName}.mp4`);
    player.classList.remove("hidden");
  } else {
    player.removeAttribute("src");
    player.classList.add("hidden");
  }

  if (data.author) {
    avatar.src = data.author.avatar || "";
    author.textContent = data.author.nickname || "";
    username.textContent = data.author.unique_id
      ? "@" + data.author.unique_id
      : "";
  } else {
    avatar.src = "";
    author.textContent = "";
    username.textContent = "";
  }
  titleEl.textContent = data.title || "";

  statPlay.textContent = fmt(data.play_count);
  statLike.textContent = fmt(data.digg_count);
  statComment.textContent = fmt(data.comment_count);
  statShare.textContent = fmt(data.share_count);

  setDL(dlNowm, data.video_no_watermark, `${baseName}-nowm.mp4`);
  setDL(dlHd, data.video_no_watermark_hd, `${baseName}-hd.mp4`);
  setDL(dlWm, data.video_watermark, `${baseName}-wm.mp4`);
  setDL(
    dlMp3,
    (data.music_info && data.music_info.play) || data.music,
    `${baseName}.mp3`
  );

  if (Array.isArray(data.images) && data.images.length) {
    imagesWrap.classList.remove("hidden");
    imagesEl.innerHTML = "";
    data.images.forEach((src, i) => {
      const a = document.createElement("a");
      a.href = proxied(src, `${baseName}-${i + 1}.jpg`);
      a.setAttribute("download", "");
      a.className =
        "block rounded-lg overflow-hidden border border-white/10 hover:border-white/30";
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.className = "w-full h-28 object-cover";
      a.appendChild(img);
      imagesEl.appendChild(a);
    });
  } else {
    imagesWrap.classList.add("hidden");
    imagesEl.innerHTML = "";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  const url = urlInput.value.trim();
  if (!url) return;
  setLoading(true);
  try {
    const data = await fetchInfo(url);
    render(data);
  } catch (err) {
    showError(err.message || "Terjadi kesalahan");
  } finally {
    setLoading(false);
  }
});

$("#paste").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) urlInput.value = text.trim();
  } catch (_) {
    showError("Clipboard tidak dapat diakses oleh browser ini.");
  }
});

$("#clear").addEventListener("click", () => {
  urlInput.value = "";
  result.classList.add("hidden");
  hideError();
  urlInput.focus();
});
