import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartService } from '../services/CartService.js';
import { store } from '../data/site.js';

const gofood = 'https://gofood.co.id/serang/restaurant/mie-ayam-bakso-amba-jl-sman-1-pandeglang-5a291b0c-585e-40c3-a2a6-e5a66f29a013';

export function Header() {
  const [count, setCount] = useState(CartService.count());
  const [open, setOpen] = useState(false);
  useEffect(() => { const sync = () => setCount(CartService.count()); window.addEventListener('ln-cart-change', sync); return () => window.removeEventListener('ln-cart-change', sync); }, []);
  const links = [['/', 'Beranda'], ['/katalog', 'Menu'], ['/tentang-kami', 'Tentang Amba'], ['/faq', 'FAQ'], ['/kontak', 'Lokasi']];
  return <header className="site-header"><div className="ln-container header-inner">
    <Link to="/" className="brand"><span className="brand-mark">🍜</span><span><strong>Mie Ayam Bakso Amba</strong><small>Mie Ayam · Bakso · Pandeglang</small></span></Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Buka menu">☰</button>
    <nav className={open ? 'main-nav open' : 'main-nav'}>{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
    <Link to="/keranjang" className="cart-link" aria-label={`Keranjang, ${count} barang`}>🛒 <span>Keranjang</span><b>{count}</b></Link>
  </div></header>;
}

export function Footer() { return <footer className="site-footer"><div className="ln-container footer-grid">
  <div><Link to="/" className="brand footer-brand"><span className="brand-mark">🍜</span><span><strong>{store.name}</strong><small>{store.tagline}</small></span></Link><p>Mie ayam dan bakso hangat di Jl. SMAN 1 Pandeglang.</p></div>
  <div><h3>Jelajahi</h3><Link to="/katalog">Lihat Menu</Link><Link to="/tentang-kami">Tentang Amba</Link><Link to="/faq">Pusat Info</Link></div>
  <div><h3>Bantuan</h3><Link to="/kontak">Lokasi Kedai</Link><Link to="/kebijakan-privasi">Kebijakan Privasi</Link><Link to="/syarat-ketentuan">Syarat &amp; Ketentuan</Link></div>
  <div><h3>Kontak</h3><p>{store.shortAddress}</p><a href={gofood} target="_blank" rel="noreferrer">Buka halaman GoFood ↗</a><p>{store.hours}</p></div>
  </div><div className="footer-bottom">© {new Date().getFullYear()} Mie Ayam Bakso Amba. Harga dan menu dapat berubah.</div></footer>; }

export function PageHero({ title, description }) { return <section className="ln-page-hero"><div className="ln-container"><h1>{title}</h1><p>{description}</p></div></section>; }
export function Breadcrumb({ items }) { return <nav className="ln-breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((x, i) => <li key={`${x.label}-${i}`}>{i > 0 && <span className="ln-breadcrumbs-sep">›</span>}{x.to && i < items.length - 1 ? <Link to={x.to}>{x.label}</Link> : <span className="ln-breadcrumbs-current">{x.label}</span>}</li>)}</ol></nav>; }
export function ProductCard({ product }) { return <article className="ln-product-card"><Link className="product-image-wrap" to={`/produk/${product.slug}`}><img src={product.image} alt={product.name} loading="lazy"/><span className="ln-badge ln-badge-gold">{product.badge}</span></Link><div className="ln-product-card-body"><span className="product-category">{product.categoryName}</span><h3><Link to={`/produk/${product.slug}`}>{product.name}</Link></h3><p>{product.description}</p><div className="product-price"><strong>Rp {product.price.toLocaleString('id-ID')}</strong>{product.originalPrice && <del>Rp {product.originalPrice.toLocaleString('id-ID')}</del>}<small>/ {product.defaultWeight}</small></div><Link className="ln-btn ln-btn-primary ln-btn-block" to={`/produk/${product.slug}`}>Pilih Menu</Link></div></article>; }
export function Toast({ message, onClose }) { useEffect(() => { if (!message) return; const timer = setTimeout(onClose, 2600); return () => clearTimeout(timer); }, [message, onClose]); return message ? <div className="toast" role="status">{message}</div> : null; }
