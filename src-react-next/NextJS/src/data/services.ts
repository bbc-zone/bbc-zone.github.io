import { publicAssetPath } from "@/config/paths";

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
};

export const services: ServiceItem[] = [
  {
    id: "lcd",
    name: "Ganti LCD & Touchscreen",
    description:
      "Konsultasikan penggantian layar retak, bergaris, atau touchscreen yang tidak responsif sesuai kondisi perangkat Anda.",
    image: publicAssetPath("/images/screen-repair.webp"),
    imageAlt: "Smartphone dengan layar yang sedang diperiksa untuk perbaikan display",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai penggantian LCD smartphone. Mohon informasi lebih lanjut.",
  },
  {
    id: "battery",
    name: "Ganti Baterai",
    description:
      "Diskusikan opsi penanganan baterai yang cepat drop, menggelembung, atau tidak mengisi dengan normal.",
    image: publicAssetPath("/images/battery-repair.webp"),
    imageAlt: "Baterai perangkat yang sedang ditangani pada area kerja perbaikan",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai penggantian baterai smartphone. Mohon informasi lebih lanjut.",
  },
  {
    id: "charger",
    name: "Perbaikan Port Charger",
    description:
      "Laporkan kendala charge yang longgar, tidak terdeteksi, atau putus-putus untuk dibantu pemeriksaan lebih lanjut.",
    image: publicAssetPath("/images/charging-port.webp"),
    imageAlt: "Beberapa smartphone yang merepresentasikan pemeriksaan port pengisian daya",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai perbaikan port charger smartphone. Mohon informasi lebih lanjut.",
  },
  {
    id: "software",
    name: "Perbaikan Software",
    description:
      "Konsultasikan kendala software seperti bootloop, aplikasi error, atau sistem yang tidak berjalan semestinya.",
    image: publicAssetPath("/images/smartphone-closeup.webp"),
    imageAlt: "Tampilan dekat smartphone sebagai ilustrasi pemeriksaan software",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai perbaikan software smartphone. Mohon informasi lebih lanjut.",
  },
  {
    id: "dead",
    name: "Diagnosis HP Mati Total",
    description:
      "Ceritakan kondisi HP yang tidak menyala untuk mendapatkan arah pemeriksaan awal sebelum penanganan lanjutan.",
    image: publicAssetPath("/images/motherboard-repair.webp"),
    imageAlt: "Teknisi memeriksa papan sirkuit smartphone dengan alat presisi",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai diagnosis HP mati total. Mohon informasi lebih lanjut.",
  },
  {
    id: "camera",
    name: "Perbaikan Kamera & Speaker",
    description:
      "Sampaikan masalah kamera buram, tidak fokus, atau speaker yang kecil/serak untuk dibantu peninjauan.",
    image: publicAssetPath("/images/camera-speaker.webp"),
    imageAlt: "Pengguna memegang smartphone yang merepresentasikan pemeriksaan kamera dan audio",
    whatsappMessage:
      "Halo DicoFix, saya ingin konsultasi mengenai perbaikan kamera dan speaker smartphone. Mohon informasi lebih lanjut.",
  },
];

