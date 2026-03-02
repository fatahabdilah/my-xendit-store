import { NextResponse } from 'next/server';
import Xendit from 'xendit-node';

export async function POST(request: Request) {
  // DEBUG: Cek apakah key terbaca di terminal (Hanya untuk testing!)
  console.log("Key Terbaca:", process.env.XENDIT_SECRET_KEY?.substring(0, 20) + "...");

  if (!process.env.XENDIT_SECRET_KEY) {
    return NextResponse.json({ error: "Secret Key tidak ditemukan di environment" }, { status: 500 });
  }

  const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
  });

  try {
    const { items, totalAmount } = await request.json();
    
    // Gunakan xenditClient.Invoice (Sesuai dokumentasi SDK v2)
  // src/app/api/checkout/route.ts
const response = await xenditClient.Invoice.createInvoice({
  data: {
    externalId: `order-${Date.now()}`,
    amount: totalAmount,
    currency: "IDR",
    description: "Pembayaran Asli Toko Fatah",
    // Menentukan metode pembayaran (Opsional, secara default semua aktif)
    paymentMethods: ["QRIS", "VIRTUAL_ACCOUNT", "EWALLET"],
    successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
 // Invoice berlaku 1 jam
  }
});

    return NextResponse.json({ invoiceUrl: response.invoiceUrl });
  } catch (error: any) {
    console.error("Xendit Error Detail:", error);
    return NextResponse.json({ 
      error: error.errorMessage || "Gagal membuat invoice",
      code: error.errorCode 
    }, { status: 500 });
  }
}