import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header, Footer } from './components/Shared.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; }

export default function App() { return <HashRouter><ScrollToTop /><Header /><Routes>
  <Route path="/" element={<HomePage />} /><Route path="/katalog" element={<CatalogPage />} />
  <Route path="/produk/:slug" element={<ProductPage />} /><Route path="/keranjang" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} /><Route path="/tentang-kami" element={<AboutPage />} />
  <Route path="/kontak" element={<ContactPage />} /><Route path="/faq" element={<FaqPage />} />
  <Route path="/kebijakan-privasi" element={<PrivacyPage />} /><Route path="/syarat-ketentuan" element={<TermsPage />} />
  <Route path="*" element={<NotFoundPage />} />
  </Routes><Footer /></HashRouter>; }
