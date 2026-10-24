export const businessConfig = {
  name: "DicoFix",
  owner: "Dico Hermawan",
  tagline: "HP Rusak? DicoFix Aja!",
  secondaryTagline: "Your Phone, Our Priority.",
  description:
    "DicoFix merupakan layanan perbaikan smartphone yang membantu pelanggan menangani berbagai permasalahan perangkat, mulai dari layar rusak, baterai bermasalah, kerusakan port charger, gangguan software, hingga diagnosis HP mati total.",
  address: "Alamat toko belum dikonfigurasi",
  mapsUrl: "",
  openingHours: "Jam operasional belum dikonfigurasi",
  siteUrl: "",
} as const;

export const PLACEHOLDERS = {
  address: "Alamat toko belum dikonfigurasi",
  openingHours: "Jam operasional belum dikonfigurasi",
} as const;

export const navItems = [
  { href: "#beranda", label: "Beranda" },
  { href: "#layanan", label: "Layanan" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontak", label: "Kontak" },
] as const;
