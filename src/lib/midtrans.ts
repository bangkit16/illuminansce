/**
 * Midtrans Integration Helper & Architecture
 *
 * Saat USE_MIDTRANS=false (default):
 * - Menggunakan simulasi lokal / mock token.
 *
 * Saat USE_MIDTRANS=true:
 * - Gunakan kredensial resmi di server-side untuk generate Snap Token.
 */

export const IS_MIDTRANS_ENABLED =
  process.env.NEXT_PUBLIC_USE_MIDTRANS === "true" ||
  process.env.USE_MIDTRANS === "true";

export interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    first_name: string;
    email: string;
    phone: string;
    billing_address?: {
      address: string;
      city: string;
      postal_code: string;
    };
  };
  itemDetails?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MidtransTransactionResult {
  isMock: boolean;
  token?: string;
  redirectUrl?: string;
  error?: string;
}

/**
 * Buat transaksi Midtrans Snap token
 * ponytail: Mock token saat USE_MIDTRANS=false. Ganti dengan fetch ke https://app.sandbox.midtrans.com/snap/v1/transactions saat key aktif.
 */
export async function createMidtransSnapToken(
  params: CreateTransactionParams
): Promise<MidtransTransactionResult> {
  if (!IS_MIDTRANS_ENABLED) {
    return {
      isMock: true,
      token: `MOCK_SNAP_${params.orderId}`,
      redirectUrl: `/checkout/bayar?orderId=${encodeURIComponent(params.orderId)}`,
    };
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.warn("MIDTRANS_SERVER_KEY belum diisi, fallback ke mock.");
    return {
      isMock: true,
      token: `MOCK_SNAP_${params.orderId}`,
      redirectUrl: `/checkout/bayar?orderId=${encodeURIComponent(params.orderId)}`,
    };
  }

  try {
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const endpoint = isProd
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: params.orderId,
          gross_amount: Math.round(params.grossAmount),
        },
        customer_details: params.customerDetails,
        item_details: params.itemDetails,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Gagal membuat transaksi Midtrans");
    }

    return {
      isMock: false,
      token: data.token,
      redirectUrl: data.redirect_url,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error tidak diketahui";
    return {
      isMock: true,
      error: message,
    };
  }
}
