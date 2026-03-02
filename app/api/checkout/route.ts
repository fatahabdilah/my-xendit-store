import { NextResponse } from 'next/server';
import Xendit from 'xendit-node';

export async function POST(request: Request) {
  // Pastikan Secret Key terbaca
  const secretKey = process.env.XENDIT_SECRET_KEY;
  
  if (!secretKey) {
    return NextResponse.json(
      { error: "API Key tidak terbaca di server Vercel" },
      { status: 500 }
    );
  }

  const xenditClient = new Xendit({ secretKey });

  try {
    const { items, totalAmount } = await request.json();

    // Gunakan URL absolut dari environment variable Vercel jika tersedia
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (request.headers.get('origin') || 'http://localhost:3000');

    const response = await xenditClient.Invoice.createInvoice({
      data: {
        externalId: `invoice-${Date.now()}`,
        amount: totalAmount,
        currency: "IDR",
        description: "Pembayaran Toko Fatah Online",
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        successRedirectUrl: `${baseUrl}/success`,
        failureRedirectUrl: `${baseUrl}`,
      }
    });

    return NextResponse.json({ invoiceUrl: response.invoiceUrl });

  } catch (error: any) {
    // Log ini akan muncul di 'Logs' tab di Vercel Dashboard
    console.error("XENDIT_ERROR_LOG:", error);

    return NextResponse.json({ 
      error: "Gagal memproses pembayaran ke Xendit",
      message: error.errorMessage || "Pastikan API Key berstatus Write untuk Invoices"
    }, { status: 500 });
  }
}