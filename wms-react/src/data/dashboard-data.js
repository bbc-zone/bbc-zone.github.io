import { Boxes, ClipboardCheck, PackagePlus, Truck } from 'lucide-react';

export const metrics = [
  { label: 'Masuk dari Produksi', value: '128', note: 'unit hari ini', icon: PackagePlus },
  { label: 'Final Step', value: '342', note: 'item diproses', icon: ClipboardCheck },
  { label: 'Stok Aktif', value: '12.8K', note: 'unit tersedia', icon: Boxes },
  { label: 'Outbound Siap', value: '74', note: 'order siap kirim', icon: Truck },
];

export const activities = [
  { code: 'PRD-2401', title: 'Barang masuk dari produksi', status: 'Final Step', time: '09:20' },
  { code: 'PUT-1830', title: 'Putaway ke Rak B-12-04', status: 'Putaway', time: '10:05' },
  { code: 'PIC-6218', title: 'Picking order marketplace', status: 'Picking', time: '10:42' },
  { code: 'SHP-5521', title: 'Shipment ekspedisi reguler', status: 'Ready', time: '11:15' },
];

export const stockRows = [
  { sku: 'SKU-001928', name: 'Kardus Packing M', zone: 'A-01', qty: 842, level: 'Aman' },
  { sku: 'SKU-003417', name: 'Bubble Wrap 50m', zone: 'B-07', qty: 126, level: 'Perlu Refill' },
  { sku: 'SKU-009204', name: 'Label Thermal 100x150', zone: 'C-03', qty: 438, level: 'Aman' },
  { sku: 'SKU-014882', name: 'Tape Fragile', zone: 'D-02', qty: 58, level: 'Rendah' },
];
