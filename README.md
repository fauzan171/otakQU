# otakQU

Prototype mobile web digital wellness berbasis React 19, Tailwind CSS 4, dan Lucide. Tema terang mengikuti one-pager otakQU: background krem, kartu putih, aksen teal, dan font Inter. Frame smartphone 390px tampil pada desktop; aplikasi menggunakan viewport penuh pada ponsel.

## Jalankan

```sh
npm install
npm run dev
```

Buka http://localhost:5173. Build produksi: `npm run build`.

## Coba alurnya

- Login/registrasi: isi email atau username dan sandi contoh apa pun. Identitas baru otomatis membuat akun demo saat masuk. Registrasi menerima nama profil lalu langsung membuka Dashboard. Keluar lewat Profile. Sesi tersimpan tanpa sandi; semua akun demo berbagi data simulasi pada browser yang sama. Ini bukan autentikasi sungguhan.

- Dashboard: tekan **+100** dari 420/500 untuk memicu grayscale otomatis. Switch Brain Rot Guard mengaktifkan/menonaktifkan grayscale secara manual. Scroll berikutnya atau perubahan limit akan mengevaluasi guard lagi.
- Focus: pilih 15/25/45 menit atau custom 1–180 menit. Mulai, pause, lanjut, dan reset. Timer tetap berjalan saat pindah tab menggunakan deadline waktu nyata. Sesi selesai memberi 25 poin satu kali.
- Missions: klaim snapshot scroll di bawah limit dan centang offline sebelum tidur. Dua klaim membuka misi ketiga. Setiap misi hanya bisa diklaim satu kali dalam data demo.
- Rewards: pilih hari untuk membaca tren demo dan klik badge untuk syarat pembukaannya.
- Rewards Soluusi: tukar saldo koin dari misi/fokus dengan potongan konsultasi demo, konfirmasi biaya, lalu lihat dan salin kode di **Voucher saya**. Stok habis dan saldo kurang menonaktifkan penukaran. **Demo partner** mengubah stok lokal yang sama dengan katalog.
- Profile: ubah scroll limit dan budget, tambah/hapus aplikasi, dan toggle perlindungan/whitelist. Reset data simulasi mengembalikan fixture awal.

Pengaturan, scroll, poin, misi, dan log tersimpan di localStorage. Timer tidak dipertahankan setelah reload.

Saldo koin, stok reward, dan voucher juga tersimpan di localStorage; data lama mendapat field reward tanpa menghapus progres. Reset data simulasi mengembalikan stok dan menghapus voucher. Istilah poin pada implementasi lama ditampilkan sebagai koin, dengan nilai saldo yang sama.

[Diagram activity dan use case revisi](docs/diagrams/README.md) tersedia sebagai SVG dan source Mermaid.

[Presentasi HTML untuk referensi PPT](docs/presentation/index.html) berisi 26 slide dengan problem, sumber luar, UI aktual, serta user flow login, fokus, misi, reward dan partner. Unduh lalu buka HTML di browser; aset sudah tertanam sehingga satu file bisa dibagikan. [Panduan penyusunan ulang](docs/presentation/README.md) menjelaskan navigasi, catatan pembicara, aset screenshot, dan source yang dapat diedit.

Nominal diskon, harga koin, stok awal, dan masa berlaku Soluusi adalah contoh. Kode `DEMO-SOLUUSI-` belum diterima di checkout Soluusi. Integrasi resmi memerlukan kesepakatan ketentuan dan mekanisme penerbitan/validasi voucher dengan Soluusi. Panel partner saat ini hanya simulasi lokal, tanpa akun partner atau sinkronisasi antarperangkat.

## Batas prototype

Angka screen time, streak, dan riwayat mingguan adalah fixture demo. Counter scroll berubah melalui tombol simulasi. Browser tidak membaca aktivitas TikTok/Instagram/YouTube asli atau mengubah warna sistem operasi. Blokir saat fokus ditampilkan sebagai status simulasi; grayscale hanya diterapkan pada app preview.

## Verifikasi

- `npm run test:dom`: pengujian interaksi React dalam jsdom.
- `npm test`: Playwright dengan server dev aktif. Instal browser dengan `npx playwright install chromium` jika belum ada.
- Screenshot dari suite browser disimpan di `artifacts/` setelah tes berhasil dijalankan.

Source utama ada di `src/main.jsx`, entry di `src/entry.jsx`, dan design tokens/style di `src/styles.css`. Alasan keputusan desain dicatat di `DESIGN.md`.
