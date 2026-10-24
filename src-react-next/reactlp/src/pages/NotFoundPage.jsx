import { Link } from 'react-router-dom';
export default function NotFoundPage() { return <main className="ln-container page-container not-found"><span>404</span><h1>Halaman tidak ditemukan</h1><p>Halaman yang Anda cari tidak tersedia.</p><Link className="ln-btn ln-btn-primary" to="/">Kembali ke Beranda</Link></main>; }
