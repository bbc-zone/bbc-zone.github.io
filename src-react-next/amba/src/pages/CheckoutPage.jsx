import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Breadcrumb, PageHero } from '../components/Shared.jsx';
import { CartService } from '../services/CartService.js';

const gofood = 'https://gofood.co.id/serang/restaurant/mie-ayam-bakso-amba-jl-sman-1-pandeglang-5a291b0c-585e-40c3-a2a6-e5a66f29a013';
const whatsappNumber = '6289669568646';

export default function CheckoutPage() {
  const [items,setItems]=useState(CartService.getItems()); useEffect(()=>{const sync=()=>setItems(CartService.getItems());window.addEventListener('ln-cart-change',sync);return()=>window.removeEventListener('ln-cart-change',sync);},[]);
  const subtotal=items.reduce((s,x)=>s+x.price*x.quantity,0);
  const orderMessage = [
    'Halo, saya ingin memesan dari Mie Ayam Bakso Amba:',
    '',
    ...items.map((x)=>`• ${x.name} (${x.weight}) × ${x.quantity} — Rp ${(x.price*x.quantity).toLocaleString('id-ID')}`),
    '',
    `Perkiraan subtotal: Rp ${subtotal.toLocaleString('id-ID')}`,
    'Pengambilan pesanan: ambil di tempat.',
    'Mohon konfirmasi menu, harga, dan ketersediaan terbaru.',
    `Info GoFood: ${gofood}`,
  ].join('\n');
  const whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
  const sendOrder = (event) => {
    event.preventDefault();
    window.open(whatsapp, '_blank', 'noopener,noreferrer');
    CartService.clear();
    setItems([]);
  };
  return <main><PageHero title="Lanjutkan Pesanan" description="Kirim daftar pesanan melalui WhatsApp atau cek info menu terbaru di GoFood."/><div className="ln-container page-container"><Breadcrumb items={[{label:'Beranda',to:'/'},{label:'Keranjang',to:'/keranjang'},{label:'Pemesanan'}]}/>{!items.length?<div className="ln-empty-state"><h2 className="ln-empty-state-title">Keranjangmu kosong</h2><Link to="/katalog" className="ln-btn ln-btn-primary">Pilih menu</Link></div>:<div className="checkout-layout"><section className="ln-checkout-section"><h2>Pesananmu</h2><p>Daftar ini akan disiapkan sebagai pesan WhatsApp. Angka di bawah adalah perkiraan; menu dan harga terbaru ada di GoFood.</p>{items.map((x)=><div className="summary-row" key={x.key}><span>{x.name}<small>{x.weight} × {x.quantity}</small></span><strong>Rp {(x.price*x.quantity).toLocaleString('id-ID')}</strong></div>)}<div className="summary-total"><span>Perkiraan subtotal</span><strong>Rp {subtotal.toLocaleString('id-ID')}</strong></div><p className="pickup-notice"><strong>Pengambilan pesanan: hanya ambil di tempat.</strong><br/>Pesanan langsung lewat WhatsApp tidak menyediakan pengantaran.</p><p className="checkout-hint">WhatsApp akan menampilkan pesan siap-kirim. Pilih kontak atau nomor kedai Amba sebelum mengirim.</p><a className="ln-btn ln-btn-whatsapp ln-btn-lg" href={whatsapp} onClick={sendOrder}>Kirim Pesanan ke WhatsApp ↗</a></section><aside className="ln-summary-card"><h2>Info GoFood</h2><p>Mie Ayam Bakso Amba<br/>Jl. SMAN 1 Pandeglang, Banten</p><p>Cek menu, harga, ketersediaan, jam operasional, dan opsi pengantaran yang tersedia di GoFood.</p><a className="ln-btn ln-btn-primary ln-btn-block" href={gofood} target="_blank" rel="noreferrer">Buka GoFood Amba ↗</a></aside></div>}</div></main>;
}
