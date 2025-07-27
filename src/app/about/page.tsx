import { AiOutlineWarning } from "react-icons/ai";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start space-y-8 px-4 py-8 mt-10">
      {/* Header Section */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center animate-pulse">
        Application Created
        <span className="block text-2xl md:text-3xl mt-2 text-red-500 font-semibold">
          AC FOR ALL
        </span>
      </h1>
      <div className="w-16 h-1 bg-red-600 rounded-full"></div>

      {/* Warning Section */}
      <div className="bg-red-600/10 p-6 rounded-lg shadow-lg max-w-xl text-center">
        <div className="flex items-center justify-center mb-4">
          <AiOutlineWarning className="text-red-500 text-3xl mr-2" />
          <h2 className="text-xl md:text-2xl font-bold text-red-500">
            Peringatan Penting
          </h2>
        </div>
        <p className="text-base md:text-lg text-gray-200">
          Aplikasi ini adalah versi ilegal dan tidak memiliki izin dari pemilik aslinya. Penggunaan aplikasi ini dapat melanggar hukum dan berisiko.
        </p>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-yellow-600/10 p-6 rounded-lg shadow-lg max-w-xl text-center">
        <div className="flex items-center justify-center mb-4">
          <AiOutlineWarning className="text-yellow-500 text-3xl mr-2" />
          <h2 className="text-xl md:text-2xl font-bold text-yellow-500">
            Disclaimer
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-400">
          Pengembang tidak akan bertanggung jawab atas segala konsekuensi yang timbul dari penggunaan aplikasi ini.
        </p>
      </div>

      {/* Button Section */}
      <a href="https://akademicrypto.com/" target="_blank" rel="noopener noreferrer">
        <button className="w-full max-w-xs px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition">
          Original Version
        </button>
      </a>

      {/* Footer Section */}
      <p className="text-xs md:text-sm text-gray-400 text-center">
        © 2025 Akademi Crypto. All rights reserved.
      </p>
    </div>
  );
}