# Revisi diagram otakQU × Soluusi

Diagram ini merevisi activity flow dan use case yang diberikan pengguna. Brand tujuan penukaran adalah [Soluusi](https://soluusi.com/), platform konsultasi personal, sehingga reward berupa potongan biaya konsultasi.

- [Activity diagram — SVG](activity.svg), [PNG](activity.png), [source Mermaid](activity.mmd).
- [Use case — SVG](use-case.svg), [PNG](use-case.png), [source Mermaid](use-case.mmd).

## Perubahan dari diagram awal

Login dan registrasi demo sekarang menjadi pintu masuk aplikasi (UC-00, UC-17, UC-18). Identitas baru otomatis membuat akun contoh. Sesi menyimpan nama dan identifier tanpa sandi, dan bertahan setelah reload. Profile menyediakan keluar akun. Semua akun demo menggunakan data simulasi browser yang sama, tanpa autentikasi server.

1. Mahasiswa menukar koin; partner tidak menukar koin milik pengguna. Partner mengatur stok dan melihat sisa stok.
2. Sebelum penukaran, sistem memeriksa stok serta saldo, lalu pengguna melihat syarat dan mengonfirmasi. Pembatalan tidak mengubah koin atau stok.
3. Penukaran memperbarui saldo, stok, dan voucher bersama. Stok habis atau saldo kurang tidak menghasilkan voucher.
4. Voucher saya menyimpan kode, nominal, tanggal penukaran, minimum transaksi, dan masa berlaku.
5. Checkout tetap berada di sistem Soluusi. Garis putus-putus menunjukkan pekerjaan yang memerlukan integrasi resmi atau fitur yang belum dibangun.
6. UC-11 dan UC-12 dari referensi awal tetap tercatat sebagai rencana. Selesainya timer pada prototype bukan bukti validasi aktivitas belajar.

## Cakupan implementasi

| Use case                   | Kondisi saat ini                                                                 |
| -------------------------- | -------------------------------------------------------------------------------- |
| UC-01, UC-03, UC-08        | Simulasi monitoring dan intervensi di preview web; bukan kendali lintas aplikasi |
| UC-02, UC-04, UC-05, UC-07 | Pengaturan, timer, klaim misi, progres dan pencapaian di prototype               |
| UC-06, UC-13, UC-14, UC-15 | Alur penukaran dan penyimpanan voucher demo; saldo dan stok tersimpan lokal      |
| UC-09, UC-10               | Panel demo partner dan katalog memakai stok yang sama dalam browser ini          |
| UC-11, UC-12               | Rencana validasi aktivitas dan check-in belajar; belum diimplementasikan         |
| UC-16                      | Rencana penggunaan voucher saat checkout Soluusi; belum diintegrasikan           |

## Ketentuan contoh

| Potongan konsultasi | Harga koin | Stok awal demo | Minimum transaksi | Masa berlaku          |
| ------------------- | ---------: | -------------: | ----------------- | --------------------- |
| Rp25.000            |        200 |             10 | Rp100.000         | 30 hari sejak ditukar |
| Rp50.000            |        400 |              5 | Rp200.000         | 30 hari sejak ditukar |
| Rp75.000            |        600 |              0 | Rp300.000         | 30 hari sejak ditukar |

Semua nominal dan stok merupakan contoh, bukan penawaran resmi Soluusi. Kode berawalan `DEMO-SOLUUSI-` tidak berlaku untuk pembayaran. Angka dapat diubah di `src/rewards.js`.

## Kebutuhan integrasi resmi

Alur nyata memerlukan akun dan otorisasi partner, katalog dan stok di server, transaksi saldo/penukaran atomik dengan idempotency key, serta kode yang diterbitkan atau diakui Soluusi. Sistem Soluusi harus memvalidasi syarat, kedaluwarsa, dan pemakaian satu kali saat checkout. Protokol API atau mekanisme penukaran perlu disepakati bersama pihak Soluusi. Prototype tidak mengirim data atau membuat voucher di sistem Soluusi.
