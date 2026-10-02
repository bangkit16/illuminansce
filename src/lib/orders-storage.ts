import { INITIAL_ORDERS, Order, OrderStatus } from "./orders-placeholder";

const ORDERS_STORAGE_KEY = "illuminance_orders_data";

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") {
    return INITIAL_ORDERS;
  }

  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Gagal membaca pesanan dari storage:", err);
  }

  return INITIAL_ORDERS;
}

export function getStoredOrderById(id: string): Order | undefined {
  const cleanId = id.trim().toLowerCase();
  const all = getStoredOrders();
  return all.find(
    (o) =>
      o.id.toLowerCase() === cleanId ||
      o.id.toLowerCase() === `#${cleanId}` ||
      o.id.replace("#", "").toLowerCase() === cleanId
  );
}

export function saveStoredOrder(order: Order): Order {
  const all = getStoredOrders();
  const existingIdx = all.findIndex((o) => o.id === order.id);

  let updatedList: Order[];
  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = order;
  } else {
    updatedList = [order, ...all];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event("illuminance:orders-updated"));
    } catch (err) {
      console.error("Gagal menyimpan pesanan:", err);
    }
  }

  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const order = getStoredOrderById(id);
  if (!order) return null;

  const updated: Order = {
    ...order,
    status,
  };

  saveStoredOrder(updated);
  return updated;
}
