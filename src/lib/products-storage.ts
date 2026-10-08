import { Product, products } from "./products-placeholder";

const STORAGE_KEY = "illuminance_products_data";

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp");
}

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return products;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return products;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const hasStaleImages = parsed.some(
        (p: Product) => p.imageOff && p.imageOff.includes("unsplash.com")
      );
      if (hasStaleImages) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        return products;
      }
      return parsed;
    }
  } catch (err) {
    console.error("Gagal membaca produk dari storage:", err);
  }

  return products;
}

export function getStoredProductById(id: string): Product | undefined {
  const all = getStoredProducts();
  return all.find((p) => p.id === id);
}

export function saveStoredProduct(
  data: Omit<Product, "priceFormatted"> & { priceFormatted?: string }
): Product {
  const all = getStoredProducts();
  const formattedPrice = formatRupiah(data.price);
  const fullProduct: Product = {
    ...data,
    priceFormatted: formattedPrice,
  };

  const existingIndex = all.findIndex((p) => p.id === fullProduct.id);
  let updatedList: Product[];

  if (existingIndex >= 0) {
    updatedList = [...all];
    updatedList[existingIndex] = fullProduct;
  } else {
    updatedList = [fullProduct, ...all];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      // Dispatch custom event agar komponen lain bisa bereaksi realtime
      window.dispatchEvent(new Event("illuminance:products-updated"));
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
    }
  }

  return fullProduct;
}

export function deleteStoredProduct(id: string): boolean {
  const all = getStoredProducts();
  const filtered = all.filter((p) => p.id !== id);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event("illuminance:products-updated"));
      return true;
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      return false;
    }
  }
  return false;
}

export function toggleStoredProductStock(id: string): boolean | null {
  const all = getStoredProducts();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const target = all[index];
  const nextStatus = !target.isLowStock;
  all[index] = { ...target, isLowStock: nextStatus };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event("illuminance:products-updated"));
      return nextStatus;
    } catch (err) {
      console.error("Gagal mengubah status stok:", err);
    }
  }
  return nextStatus;
}
