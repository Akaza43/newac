import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Image
        src="/ac.png"
        alt="AC Logo"
        width={100}
        height={100}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-xl mb-6">Modul Tidak Ditemukan</h2>
      <p className="text-gray-400 mb-8">Maaf, modul pembelajaran yang Anda cari tidak tersedia atau belum diunggah</p>
      <Link 
        href="/" 
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Kembali ke Beranda
      </Link>
      <p className="text-sm text-gray-400 mt-8">© {new Date().getFullYear()} AC FOR ALL-APP-V1.0 All rights reserved.</p>
    </div>
  );
}
