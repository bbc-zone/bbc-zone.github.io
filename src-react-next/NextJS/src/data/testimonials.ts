export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  quote: string;
};

export const TESTIMONIALS_ARE_DUMMY = true;

export const testimonials: Testimonial[] = [
  {
    id: "andi",
    name: "Andi Pratama",
    rating: 5,
    quote:
      "LCD HP saya pecah, setelah diperbaiki hasilnya bagus. Pengerjaannya juga cepat dan komunikatif.",
  },
  {
    id: "rizky",
    name: "Rizky Ramadhan",
    rating: 5,
    quote:
      "Awalnya HP saya mati total. Setelah konsultasi, dijelaskan kemungkinan kerusakan dan estimasi biayanya.",
  },
  {
    id: "siti",
    name: "Siti Rahmawati",
    rating: 5,
    quote:
      "Pelayanannya ramah, harga dijelaskan di awal, dan proses perbaikannya transparan.",
  },
  {
    id: "fajar",
    name: "Fajar Maulana",
    rating: 5,
    quote:
      "Baterai HP saya cepat habis. Setelah diganti, sekarang pemakaiannya jauh lebih nyaman.",
  },
  {
    id: "dewi",
    name: "Dewi Anggraini",
    rating: 5,
    quote:
      "Enak bisa konsultasi lewat WhatsApp dulu sebelum datang ke tempat service.",
  },
  {
    id: "budi",
    name: "Budi Santoso",
    rating: 5,
    quote:
      "Port charger HP saya bermasalah. Sekarang sudah bisa digunakan kembali dengan normal.",
  },
];
