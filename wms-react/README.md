# React WMS

Project React untuk dashboard awal Warehouse Management System (WMS), dibuat dengan Vite.

## Menjalankan Project

```bash
npm install
npm run dev
```

Local URL:

```text
http://localhost:9997/
```

## Konfigurasi API

Semua koneksi API React dipusatkan di helper:

```text
src/api-connection.js
```

URL API dibaca dari file config runtime:

```text
public/api-config.json
```

Isi default:

```json
{
  "apiBaseUrl": "http://localhost:9000"
}
```

Saat `npm run build`, file ini akan ikut masuk ke:

```text
dist/api-config.json
```

Untuk mengganti koneksi API setelah build, ubah `dist/api-config.json` tanpa perlu build ulang.

## Build Production

```bash
npm run build
```
