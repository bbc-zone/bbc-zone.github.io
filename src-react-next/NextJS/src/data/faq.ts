export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "konsultasi",
    question: "Apakah bisa konsultasi sebelum datang?",
    answer:
      "Bisa. Seluruh konsultasi awal DicoFix dilakukan melalui WhatsApp. Anda dapat menjelaskan merek, model, dan keluhan perangkat terlebih dahulu agar teknisinya membantu merinci informasi yang dibutuhkan.",
  },
  {
    id: "durasi",
    question: "Berapa lama proses service HP?",
    answer:
      "Durasi pengerjaan bergantung pada jenis kerusakan, ketersediaan suku cadang, dan hasil pemeriksaan. Kami belum menetapkan waktu baku di website ini. Tanyakan estimasi waktu secara langsung melalui WhatsApp setelah kondisi perangkat dijelaskan.",
  },
  {
    id: "lcd",
    question: "Apakah tersedia layanan penggantian LCD?",
    answer:
      "Penggantian LCD dan touchscreen termasuk layanan yang dapat dikonsultasikan. Ketersediaan part dan opsi penanganan akan dikonfirmasi setelah model HP Anda diketahui. Hubungi DicoFix via WhatsApp untuk pengecekan.",
  },
  {
    id: "estimasi",
    question: "Bagaimana cara mengetahui estimasi biaya?",
    answer:
      "Gunakan formulir estimasi di halaman ini, lalu kirimkan merek, model, dan jenis kerusakan melalui WhatsApp. Estimasi yang lebih akurat biasanya membutuhkan informasi kondisi perangkat, dan bila perlu pemeriksaan langsung.",
  },
  {
    id: "mati-total",
    question: "Apakah HP mati total masih bisa diperbaiki?",
    answer:
      "HP mati total perlu diagnosis terlebih dahulu. Tidak semua perangkat dapat dipastikan bisa kembali normal sebelum diperiksa. Kirimkan gejala dan riwayat kejadian ke WhatsApp agar teknisi dapat menjelaskan langkah pemeriksaan yang sesuai.",
  },
  {
    id: "garansi",
    question: "Apakah tersedia garansi service?",
    answer:
      "Ketentuan garansi belum dipublikasikan di website ini karena masih menunggu konfirmasi pemilik. Jangan ragu menanyakan kebijakan garansi, ruang lingkupnya, dan syaratnya langsung melalui WhatsApp sebelum menyetujui perbaikan.",
  },
];
