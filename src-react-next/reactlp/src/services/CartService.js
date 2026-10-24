const KEY = 'ln_reactlp_cart_v1';

export class CartService {
  static getItems() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  static save(items) { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event('ln-cart-change')); return items; }
  static add(product, weight = product.defaultWeight, quantity = 1) {
    const option = product.weights.find((w) => w.weight === weight) || product.weights[0];
    const items = this.getItems();
    const key = `${product.id}:${option.weight}`;
    const existing = items.find((item) => item.key === key);
    if (existing) existing.quantity += quantity;
    else items.push({ key, productId: product.id, slug: product.slug, name: product.name, image: product.image, weight: option.weight, price: option.price, quantity });
    return this.save(items);
  }
  static update(key, quantity) { return this.save(this.getItems().map((x) => x.key === key ? { ...x, quantity: Math.max(1, Number(quantity) || 1) } : x)); }
  static remove(key) { return this.save(this.getItems().filter((x) => x.key !== key)); }
  static clear() { return this.save([]); }
  static count() { return this.getItems().reduce((sum, x) => sum + x.quantity, 0); }
  static subtotal() { return this.getItems().reduce((sum, x) => sum + x.price * x.quantity, 0); }
}
