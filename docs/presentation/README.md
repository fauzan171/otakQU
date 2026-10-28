# Referensi presentasi otakQU

Buka **index.html** di browser. File ini memuat sendiri screenshot aplikasi, diagram, CSS, dan JavaScript. Kirim satu file HTML tersebut kepada teman untuk review tanpa harus menjalankan aplikasi atau mengunduh aset lain. Tautan sumber membutuhkan internet saat dibuka.

## Isi dan penggunaan

Presentasi berisi 26 slide dalam bahasa Indonesia: problem, riset luar, pengguna sasaran, referensi produk, solusi, login/registrasi demo, UI aktual, user flow lengkap, use case, reward Soluusi, stok partner, kondisi alternatif, status prototype, rencana integrasi, validasi, panduan PPT, dan sumber.

- Tombol Sebelumnya/Berikutnya, panah keyboard, serta Page Up/Page Down memindahkan slide.
- Pilihan slide dapat langsung melompat ke topik tertentu. Hash seperti `#slide-18` membuka alur penukaran.
- **Catatan** menampilkan penjelasan untuk presenter dan batas klaim.
- **Mode baca** menampilkan seluruh slide beserta catatan. Mode ini aktif otomatis pada layar kecil.
- **Buka diagram** menampilkan diagram lengkap yang dapat digeser dan diperbesar.
- **Cetak / PDF** menggunakan format slide 16:9. Pilih Save as PDF pada dialog browser bila diperlukan.

Untuk membuat ulang PowerPoint, gunakan susunan 13 slide pada halaman 25. Ambil screenshot asli di `assets/` dan diagram SVG/PNG pada `../diagrams/`. Konten teks, struktur alur, dan tabel dapat diedit di `source.html`. Semua kode dan angka reward adalah demo, serta belum menjadi penawaran resmi Soluusi.

## Referensi luar

- [Meinhardt dkk., Scrolling in the Deep (2025)](https://arxiv.org/abs/2501.11814): konteks respons terhadap intervensi scrolling.
- [Ruiz dkk., Design Frictions on Social Media (2024)](https://arxiv.org/abs/2407.18803): manfaat dan ketidaknyamanan friksi desain.
- [Google Digital Wellbeing](https://support.google.com/android/answer/9346420?hl=en): penggunaan, batas aplikasi, grayscale, dan Focus mode.
- [Forest](https://www.forestapp.cc/): hubungan timer dengan progres fokus.
- [Soluusi](https://soluusi.com/): jenis layanan dan alur konsultasi.

Sumber diakses 28 Oktober 2026. Temuan riset luar bukan bukti efektivitas otakQU. Job story dan skenario problem berasal dari hipotesis brief, bukan hasil wawancara.

## Arah desain

Mengikuti identitas otakQU yang ada: arang, mint dan violet. Latar terang pada bagian analisis menjaga keterbacaan diagram dan tabel. Latar gelap dipakai untuk pembuka serta pengenalan solusi. Arial tersedia lokal supaya file tetap berfungsi offline. ENERGY 2 / RHYTHM 2 / MOTION 1: susunan bergantian mengikuti isi, tanpa animasi dekoratif. Screenshot berasal dari aplikasi sendiri. Tidak ada gambar orang, logo brand rekaan, testimoni, atau statistik pasar yang dibuat-buat.

## Regenerasi

1. Jalankan aplikasi di port 5180: `npm run dev -- --port 5180`.
2. Ambil ulang UI setelah perubahan: `node scripts/capture-presentation.mjs`.
3. Buat file HTML tunggal: `node scripts/build-presentation.mjs`.

Script capture menggunakan Playwright yang sudah menjadi dependency proyek. Tidak ada dependency baru pada aplikasi.
