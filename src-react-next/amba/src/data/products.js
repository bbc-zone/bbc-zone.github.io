const food = 'assets/images/mie-ayam-hero.png';
const bakso = 'assets/images/bakso-kuah.webp';

export const products = [
  { id: 1, slug: 'mie-ayam-original', name: 'Mie Ayam Original', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 10000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 10000 }], badge: 'Favorit', image: food, description: 'Mie kenyal dengan ayam berbumbu gurih, sayuran segar, dan taburan bawang goreng.', specialty: true },
  { id: 2, slug: 'mie-ayam-bakso', name: 'Mie Ayam Bakso', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 12000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 12000 }], badge: 'Paling dicari', image: food, description: 'Mie ayam gurih dengan bakso sapi dan kuah hangat yang nikmat.', specialty: true },
  { id: 3, slug: 'mie-ayam-bakso-pangsit', name: 'Mie Ayam Bakso & Pangsit', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 22000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 22000 }], badge: 'Komplet', image: food, description: 'Semangkuk lengkap mie ayam dengan bakso, pangsit, sayuran, dan kuah kaldu.', specialty: true },
  { id: 4, slug: 'mie-ayam-pangsit', name: 'Mie Ayam Pangsit', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 18000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 18000 }], badge: 'Gurih', image: food, description: 'Mie ayam dengan pangsit lembut, ayam berbumbu, dan kuah kaldu hangat.', specialty: true },
  { id: 5, slug: 'bakso-kuah', name: 'Bakso Kuah', category: 'bakso', categoryName: 'Bakso', price: 10000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 10000 }], badge: 'Hangat', image: bakso, description: 'Bakso kenyal dalam kuah kaldu hangat, cocok dinikmati kapan saja.', specialty: false },
  { id: 6, slug: 'bakso-urat', name: 'Bakso Urat', category: 'bakso', categoryName: 'Bakso', price: 15000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 15000 }], badge: 'Favorit', image: food, description: 'Bakso urat dengan tekstur mantap, disajikan bersama kuah kaldu dan pelengkap.', specialty: false },
  { id: 7, slug: 'es-teh-manis', name: 'Es Teh Manis', category: 'minuman', categoryName: 'Minuman', price: 3000, originalPrice: null, defaultWeight: '1 gelas', weights: [{ weight: '1 gelas', price: 3000 }], badge: 'Segar', image: food, description: 'Teh manis dingin sebagai teman makan mie ayam dan bakso.', specialty: false },
  { id: 8, slug: 'es-jeruk', name: 'Es Jeruk', category: 'minuman', categoryName: 'Minuman', price: 5000, originalPrice: null, defaultWeight: '1 gelas', weights: [{ weight: '1 gelas', price: 5000 }], badge: 'Segar', image: food, description: 'Minuman jeruk dingin dengan rasa segar untuk melengkapi santapan.', specialty: false },
  { id: 9, slug: 'bakso-telur', name: 'Bakso Telur', category: 'bakso', categoryName: 'Bakso', price: 15000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 15000 }], badge: 'Isi telur', image: 'assets/images/bakso-telur.webp', description: 'Bakso isi telur yang disajikan dengan kuah kaldu hangat.', specialty: false },
  { id: 10, slug: 'mie-ayam-ceker', name: 'Mie Ayam Ceker', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 12000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 12000 }], badge: 'Favorit', image: 'assets/images/mie-ayam-ceker.webp', description: 'Mie ayam gurih dengan ceker berbumbu dan sayuran segar.', specialty: false },
  { id: 11, slug: 'mie-ayam-bakso-urat', name: 'Mie Ayam Bakso Urat', category: 'mie-ayam', categoryName: 'Mie Ayam', price: 15000, originalPrice: null, defaultWeight: '1 porsi', weights: [{ weight: '1 porsi', price: 15000 }], badge: 'Bakso urat', image: food, description: 'Mie ayam dengan bakso urat kenyal dan kuah kaldu hangat.', specialty: false },
  { id: 12, slug: 'air-mineral', name: 'Air Mineral', category: 'minuman', categoryName: 'Minuman', price: 3000, originalPrice: null, defaultWeight: '1 botol', weights: [{ weight: '1 botol', price: 3000 }], badge: 'Dingin', image: 'assets/images/air-mineral.webp', description: 'Air mineral botol untuk menemani hidangan favoritmu.', specialty: false },
  { id: 13, slug: 'kopi-ice', name: 'Kopi Ice', category: 'kopi', categoryName: 'Kopi', price: 5000, originalPrice: null, defaultWeight: '1 gelas', weights: [{ weight: '1 gelas', price: 5000 }], badge: 'Kopi', image: 'assets/images/kopi-ice.webp', description: 'Kopi dingin yang segar, disajikan dengan es.', specialty: false },
  { id: 14, slug: 'kopi-hot', name: 'Kopi Hot', category: 'kopi', categoryName: 'Kopi', price: 5000, originalPrice: null, defaultWeight: '1 gelas', weights: [{ weight: '1 gelas', price: 5000 }], badge: 'Kopi', image: 'assets/images/kopi-hot.webp', description: 'Kopi hangat dengan aroma yang nikmat.', specialty: false },
  { id: 15, slug: 'pop-ice', name: 'POP Ice', category: 'minuman', categoryName: 'Minuman', price: 3000, originalPrice: null, defaultWeight: '1 gelas', weights: [{ weight: '1 gelas', price: 3000 }], badge: 'Warna-warni', image: 'assets/images/pop-ice.webp', description: 'Minuman POP Ice dingin dengan rasa manis dan menyegarkan.', specialty: false },
];

export const categories = [
  { slug: 'all', name: 'Semua Menu' },
  { slug: 'mie-ayam', name: 'Mie Ayam' },
  { slug: 'bakso', name: 'Bakso' },
  { slug: 'minuman', name: 'Minuman' },
  { slug: 'kopi', name: 'Kopi' },
];

