# TikTok Downloader (Full-Stack)

Website downloader TikTok sederhana:

- **Backend:** Node.js + Express. Endpoint `POST /api/download` menerima link
  TikTok dan mengembalikan metadata + URL video (no-watermark / HD / watermark)
  serta audio MP3. Endpoint `GET /api/proxy` men-stream file dari upstream
  (tikwm.com) sebagai attachment agar tombol download bekerja lintas origin.
- **Frontend:** HTML statis + Tailwind (CDN) + JS vanilla. UI dark, preview
  video, avatar + nickname author, stats (views/likes/komentar/share), dan
  tombol download.

## Jalankan lokal

```bash
cd tiktok-downloader
npm install
npm start
# buka http://localhost:3000
```

Port dapat diatur lewat env `PORT`.

## Endpoints

### `POST /api/download`

```json
{ "url": "https://www.tiktok.com/@user/video/..." }
```

Respons sukses:

```json
{
  "ok": true,
  "data": {
    "id": "...",
    "title": "...",
    "cover": "https://www.tikwm.com/...",
    "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
    "video_no_watermark": "https://www.tikwm.com/...",
    "video_no_watermark_hd": "https://www.tikwm.com/...",
    "video_watermark": "https://www.tikwm.com/...",
    "music": "https://www.tikwm.com/...",
    "play_count": 123, "digg_count": 45, "comment_count": 6, "share_count": 7,
    "images": null
  }
}
```

### `GET /api/proxy?url=<encoded>&filename=<name>`

Men-stream file dari `*.tikwm.com` dengan header `Content-Disposition:
attachment` sehingga langsung terunduh di browser.

### `GET /api/health`

Health check sederhana: `{ "ok": true }`.

## Catatan

Downloader ini mengandalkan layanan publik **tikwm.com** untuk resolusi URL.
Jika tikwm.com down atau mengubah skema, endpoint `/api/download` akan
mengembalikan `502`. Silakan hormati hak cipta kreator — jangan mengunggah
ulang konten tanpa izin.
