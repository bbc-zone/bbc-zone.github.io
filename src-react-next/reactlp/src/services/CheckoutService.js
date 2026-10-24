import { store } from '../data/site.js';

export class CheckoutService {
  static buildMessage({ customer, items, shipping, shippingPrice, payment, subtotal }) {
    const lines = items.map((x) => `• ${x.name} (${x.weight}) × ${x.quantity} — Rp ${(x.price * x.quantity).toLocaleString('id-ID')}`);
    const text = [
      'Halo Admin Lumbung Nusantara, saya ingin memesan:', '', ...lines, '',
      `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}`, `Pengiriman: ${shipping} — Rp ${shippingPrice.toLocaleString('id-ID')}`,
      `Total: Rp ${(subtotal + shippingPrice).toLocaleString('id-ID')}`, `Pembayaran: ${payment}`, '',
      `Nama: ${customer.name}`, `WhatsApp: ${customer.phone}`, `Alamat: ${customer.address}, ${customer.city} ${customer.postal || ''}`.trim(),
      customer.note ? `Catatan: ${customer.note}` : '',
    ].filter(Boolean);
    return text.join('\n');
  }
  static whatsappUrl(message) { return `https://api.whatsapp.com/send?phone=${store.whatsapp}&text=${encodeURIComponent(message)}`; }
}
