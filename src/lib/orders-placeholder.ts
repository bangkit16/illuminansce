export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Diproses"
  | "Dikirim"
  | "Selesai"
  | "Batal";

export type OrderItem = {
  productId: string;
  name: string;
  variant?: string;
  qty: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  item: string;
  items?: OrderItem[];
  total: string;
  totalAmount?: number;
  date: string;
  status: OrderStatus;
  paymentMethod?: string;
  shippingMethod?: string;
  snapToken?: string;
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "#ILM-8841",
    customer: "Aris Prasetyo",
    email: "aris.prasetyo@email.com",
    item: "Lampu Meja Aruna (Kuningan)",
    total: "Rp 1.450.000",
    totalAmount: 1450000,
    date: "28 Sep 2024",
    status: "Dikirim",
    paymentMethod: "Midtrans (BCA VA)",
  },
  {
    id: "#ILM-8840",
    customer: "Dina Kartika",
    email: "dina.kartika@email.com",
    item: "Lampu Gantung Selaras (Tembaga)",
    total: "Rp 2.150.000",
    totalAmount: 2150000,
    date: "28 Sep 2024",
    status: "Diproses",
    paymentMethod: "Midtrans (QRIS)",
  },
  {
    id: "#ILM-8839",
    customer: "Budi Santoso",
    email: "budi.santoso@email.com",
    item: "Lampu Lantai Candra (Kayu Jati)",
    total: "Rp 3.200.000",
    totalAmount: 3200000,
    date: "27 Sep 2024",
    status: "Selesai",
    paymentMethod: "Transfer Bank",
  },
  {
    id: "#ILM-8838",
    customer: "Maya Anggraini",
    email: "maya.anggraini@email.com",
    item: "Lampu Dinding Pendar (Baja Hitam)",
    total: "Rp 980.000",
    totalAmount: 980000,
    date: "26 Sep 2024",
    status: "Selesai",
    paymentMethod: "Midtrans (GoPay)",
  },
  {
    id: "#ILM-8837",
    customer: "Hendra Wijaya",
    email: "hendra.w@email.com",
    item: "Lampu Meja Kinara (Keramik Terracotta)",
    total: "Rp 1.250.000",
    totalAmount: 1250000,
    date: "25 Sep 2024",
    status: "Selesai",
    paymentMethod: "Midtrans (Mandiri Bill)",
  },
];
