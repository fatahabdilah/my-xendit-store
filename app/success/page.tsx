export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-600 mb-6">Terima kasih telah berbelanja di Toko Fatah. Pesanan Anda akan segera diproses.</p>
      <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Kembali Belanja</a>
    </div>
  );
}