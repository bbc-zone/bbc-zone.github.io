export type EstimatorBrand = {
  id: string;
  name: string;
  models: string[];
};

export const estimatorBrands: EstimatorBrand[] = [
  {
    id: "samsung",
    name: "Samsung",
    models: ["Galaxy A14", "Galaxy A54", "Galaxy S23", "Lainnya / belum tercantum"],
  },
  {
    id: "apple",
    name: "Apple iPhone",
    models: ["iPhone 11", "iPhone 12", "iPhone 13", "Lainnya / belum tercantum"],
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    models: ["Redmi Note 12", "Redmi Note 13", "Poco X5", "Lainnya / belum tercantum"],
  },
  {
    id: "oppo",
    name: "OPPO",
    models: ["A78", "Reno 8", "Find X5", "Lainnya / belum tercantum"],
  },
  {
    id: "vivo",
    name: "vivo",
    models: ["Y36", "V27", "X80", "Lainnya / belum tercantum"],
  },
  {
    id: "realme",
    name: "realme",
    models: ["C55", "Narzo 60", "GT Neo", "Lainnya / belum tercantum"],
  },
  {
    id: "lainnya",
    name: "Merek lain",
    models: ["Akan saya sebutkan di chat"],
  },
];

export const estimatorProblems = [
  "LCD / Touchscreen",
  "Baterai",
  "Port charger",
  "Software",
  "HP mati total",
  "Kamera",
  "Speaker",
  "Lainnya",
] as const;
