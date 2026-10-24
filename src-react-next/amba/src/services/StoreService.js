import { products, categories } from '../data/products.js';
import { store, faqs, promos } from '../data/site.js';

export class StoreService {
  static products() { return products; }
  static categories() { return categories; }
  static store() { return store; }
  static faqs() { return faqs; }
  static promos() { return promos; }
  static findProduct(slugOrId) { return products.find((p) => p.slug === String(slugOrId) || p.id === Number(slugOrId)) ?? products[0]; }
}
