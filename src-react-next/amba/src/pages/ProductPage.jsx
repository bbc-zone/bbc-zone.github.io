import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, ProductCard } from '../components/Shared.jsx';
import { StoreService } from '../services/StoreService.js';
import { CartService } from '../services/CartService.js';

export default function ProductPage() {
  const { slug } = useParams(); const navigate = useNavigate(); const product = StoreService.findProduct(slug);
  const [weight, setWeight] = useState(product.defaultWeight); const [quantity, setQuantity] = useState(1);
  const option = product.weights.find((x)=>x.weight===weight) || product.weights[0]; const related = StoreService.products().filter((x)=>x.id!==product.id).slice(0,3);
  const add = () => { CartService.add(product, weight, quantity); navigate('/keranjang'); };
  return <main className="ln-container page-container"><Breadcrumb items={[{label:'Beranda',to:'/'},{label:'Menu',to:'/katalog'},{label:product.name}]}/><div className="detail-grid"><div className="detail-photo"><img src={product.image} alt={product.name}/></div><section className="detail-copy"><span className="ln-badge ln-badge-gold">{product.categoryName}</span><h1>{product.name}</h1><p>{product.description}</p><div className="detail-price"><strong>Rp {option.price.toLocaleString('id-ID')}</strong><span>per {product.defaultWeight}</span></div><div className="detail-control"><label>Porsi<select className="ln-input" value={weight} onChange={(e)=>setWeight(e.target.value)}>{product.weights.map((x)=><option key={x.weight}>{x.weight}</option>)}</select></label><label>Jumlah<input className="ln-input" type="number" min="1" value={quantity} onChange={(e)=>setQuantity(Math.max(1,Number(e.target.value)))}/></label></div><p className="stock-note">Harga dan ketersediaan dapat berubah. Konfirmasi saat memesan.</p><button className="ln-btn ln-btn-primary ln-btn-lg" onClick={add}>Tambah ke Keranjang</button><a className="detail-wa" href="https://gofood.co.id/serang/restaurant/mie-ayam-bakso-amba-jl-sman-1-pandeglang-5a291b0c-585e-40c3-a2a6-e5a66f29a013" target="_blank" rel="noreferrer">Info Menu di GoFood ↗</a></section></div><section className="ln-section related-section"><div className="ln-section-header"><h2 className="ln-section-title">Menu lainnya</h2></div><div className="ln-products-grid-3">{related.map((p)=><ProductCard key={p.id} product={p}/>)}</div></section></main>;
}

