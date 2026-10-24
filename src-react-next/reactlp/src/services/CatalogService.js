export class CatalogService {
  static filter(products, { query = '', category = 'all', weight = 'all', sort = 'popular' } = {}) {
    const q = query.trim().toLocaleLowerCase('id');
    const found = products.filter((p) => {
      const matchesQuery = !q || `${p.name} ${p.categoryName} ${p.description}`.toLocaleLowerCase('id').includes(q);
      const matchesCategory = category === 'all' || p.category === category;
      const matchesWeight = weight === 'all' || p.weights.some((w) => w.weight === weight);
      return matchesQuery && matchesCategory && matchesWeight;
    });
    if (sort === 'price-low') found.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') found.sort((a, b) => b.price - a.price);
    return found;
  }
}
