import { NextResponse } from 'next/server';
import Xendit from 'xendit-node';

export async function POST(request: Request) {
  // 1. Validasi keberadaan Secret Key di Environment
  const secretKey = process.env.XENDIT_SECRET_KEY;
  
  if (!secretKey) {
    console.error("CRITICAL ERROR: XENDIT_SECRET_KEY is missing in environment variables.");
    return NextResponse.json(
      { error: "Konfigurasi Server Salah: API Key tidak ditemukan." },
      { status: 500 }
    );
  }

  // 2. Inisialisasi Xendit Client
  const xenditClient = new Xendit({
    secretKey: secretKey,
  });

  try {
    const body = await request.json();
    const { items, totalAmount } = body;

    // 3. Deteksi Domain secara otomatis untuk Redirect URL
    // Jika di Vercel, dia akan mengambil domain vercel, jika lokal dia pakai localhost
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // 4. Membuat Invoice Xendit
    const response = await xenditClient.Invoice.createInvoice({
      data: {
        externalId: `fatah-store-${Date.now()}`,
        amount: totalAmount,
        currency: "IDR",
        description: `Pembayaran Toko Fatah - ${items.length} item`,
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        // URL otomatis menyesuaikan tempat aplikasi di-deploy
        successRedirectUrl: `${origin}/success`,
        failureRedirectUrl: `${origin}`,
      }
    });

    // 5. Kirim URL Invoice ke Frontend
    return NextResponse.json({ 
      invoiceUrl: response.invoiceUrl,
      externalId: response.externalId 
    });

  } catch (error: any) {
    // Logging detail error di console server untuk debugging
    console.error("XENDIT_API_ERROR:", error.response?.data || error.message);

    return NextResponse.json(
      { 
        error: "Gagal memproses pembayaran ke Xendit",
        message: error.errorMessage || error.message,
        errorCode: error.errorCode
      },
      { status: 500 }
    );
  }
}