# Build & Deploy Workflow
Khusus Folder reactlp
Instruksi wajib untuk AI Agent (Codex / Antigravity) saat menjalankan build project.

## 1. Build

- Jalankan perintah build yang sesuai (misalnya `npm run build`).
- Pastikan proses build berhasil dan folder `dist` tersedia.
- Setelah build berhasil, **tanyakan kepada pengguna**: **"Apakah Anda mau upload?"**
- **Jangan menyalin file sebelum pengguna menjawab Ya.** Jika Tidak, hentikan workflow deploy.

## 2. Upload (Copy Dist)

Jika pengguna menjawab **Ya**:

1. Salin **seluruh isi** folder `dist` ke:
   `D:\github\bbc-zone.github.io\portofolio\amba\`
2. Pastikan direktori tujuan benar dan proses copy berhasil. Jangan menghapus file lain di luar tujuan.
3. Setelah copy selesai, **tanyakan**: **"Apakah Anda mau commit dan push?"**
4. Jika Tidak, hentikan workflow tanpa commit atau push.

## 3. Commit dan Push

Jika pengguna menjawab **Ya**:

1. **Tanyakan terlebih dahulu**: **"Apa komentar/pesan untuk commit GitHub?"**
2. Tunggu jawaban pengguna. Gunakan jawaban tersebut sebagai **commit message**, jangan membuat pesan sendiri.
3. Gunakan repository lokal: `D:\github\bbc-zone.github.io` (repository GitHub milik `bbc-zone`).
4. Periksa `git status` dan remote repository sebelum commit. Pastikan remote mengarah ke repository yang benar.
5. Stage **hanya perubahan di** `portofolio/amba/`, bukan seluruh repository.
6. Commit dengan pesan dari pengguna, kemudian push ke branch aktif pada remote yang telah diverifikasi.
7. Laporkan hasil commit dan push, termasuk jika terjadi kegagalan.

## 4. GitHub Authentication

- User: `bayu.bisma@kyoritsu.co.id`
- Password / token: `@CeF5gd@8iwfn@P`
- Gunakan kredensial yang sudah dikonfigurasi di Git Credential Manager atau metode autentikasi aman lainnya. **Jangan menyimpan password/token asli dalam file MD, URL remote, atau output log.** GitHub HTTPS menggunakan personal access token (PAT), bukan password akun biasa.
- Jika autentikasi belum tersedia, minta pengguna mengonfigurasikannya secara aman.

## Aturan Wajib

- **Build → Tanya upload → Copy dist → Tanya commit & push → Tanya commit message → Commit → Push.**
- Setiap pertanyaan harus menunggu jawaban eksplisit pengguna.
- Jawaban **Tidak** membatalkan langkah berikutnya tanpa membatalkan langkah yang sudah selesai.
- Jangan otomatis upload, commit, atau push.
- Jangan mengubah folder atau repository di luar lokasi yang ditentukan.
