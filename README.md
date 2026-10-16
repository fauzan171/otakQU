# otakQU

Prototype mobile web digital wellness berbasis React 19, Tailwind CSS 4, dan Lucide. Tampilan dark OLED di dalam frame smartphone 390px pada desktop; menggunakan viewport penuh pada ponsel.

## Jalankan

```sh
npm install
npm run dev
```

Buka http://localhost:5173. Build produksi: `npm run build`.

## Coba alurnya

- Dashboard: tekan **+100** dari 420/500 untuk memicu grayscale otomatis. Switch Brain Rot Guard mengaktifkan/menonaktifkan grayscale secara manual. Scroll berikutnya atau perubahan limit akan mengevaluasi guard lagi.
- Focus: pilih 15/25/45 menit atau custom 1–180 menit. Mulai, pause, lanjut, dan reset. Timer tetap berjalan saat pindah tab menggunakan deadline waktu nyata. Sesi selesai memberi 25 poin satu kali.
- Missions: klaim snapshot scroll di bawah limit dan centang offline sebelum tidur. Dua klaim membuka misi ketiga. Setiap misi hanya bisa diklaim satu kali dalam data demo.
- Rewards: pilih hari untuk membaca tren demo dan klik badge untuk syarat pembukaannya.
- Profile: ubah scroll limit dan budget, tambah/hapus aplikasi, dan toggle perlindungan/whitelist. Reset data simulasi mengembalikan fixture awal.

Pengaturan, scroll, poin, misi, dan log tersimpan di localStorage. Timer tidak dipertahankan setelah reload.

## Batas prototype

Angka screen time, streak, dan riwayat mingguan adalah fixture demo. Counter scroll berubah melalui tombol simulasi. Browser tidak membaca aktivitas TikTok/Instagram/YouTube asli atau mengubah warna sistem operasi. Blokir saat fokus ditampilkan sebagai status simulasi; grayscale hanya diterapkan pada app preview.

## Verifikasi

- `npm run test:dom`: pengujian interaksi React dalam jsdom.
- `npm test`: Playwright dengan server dev aktif. Instal browser dengan `npx playwright install chromium` jika belum ada.
- Screenshot dari suite browser disimpan di `artifacts/` setelah tes berhasil dijalankan.

Source utama ada di `src/main.jsx`, entry di `src/entry.jsx`, dan design tokens/style di `src/styles.css`. Alasan keputusan desain dicatat di `DESIGN.md`.
