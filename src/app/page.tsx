"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Loading from '@/ui/loading';
import { AccessButton } from '@/components/buttons/AccessButton';
import BlockchainPage from './Halaman/3-blockchain/page';
import InvestingPage from './Halaman/2-investing/page';
import LiveclassPage from './Halaman/4-liveclass/page';
// import MargincallPage from './Halaman/5-margincall/page';
// import SoonPage from './Halaman/7-soon/page';
import TradingPage from './Halaman/1-trading/page';
import AllClassesPage from './Halaman/0-all-classes/page';
import { FaPlay } from 'react-icons/fa';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialUser, setIsTrialUser] = useState(false);

  const links = {
    startLearning: "/Halaman/page/4-liveclass/1-The-Art-of-Crypto-Trading/1-Intro-to-Modern-Day-Crypto-Trading",
    moreInfo: "/Halaman/page/4-liveclass/1-The-Art-of-Crypto-Trading"
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/verify-role", {
            headers: {
              Authorization: `Bearer {session.accessToken}`,
            },
          });

          if (!response.ok && response.status === 429) {
            setTimeout(checkAccess, 5000);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setHasAccess(true);
            setIsTrialUser(data.isTrialUser);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error verifying role:", error);
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      checkAccess();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setHasAccess(false);
    }
  }, [session, status]);

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="auth-box bg-zinc-950/90 p-8 rounded-2xl backdrop-blur-md max-w-md w-full border border-zinc-900">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Login untuk Akses Penuh
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Silahkan login untuk mengakses semua fitur premium kami:
            <ul className="mt-2 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span> Modul pembelajaran crypto
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span> Research dan analisis pasar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> Komunitas ekslusif
              </li>
            </ul>
          </p>
          <button
            onClick={() => signIn("discord")}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <i className="fas fa-lock-open mr-2"></i> Masuk dengan Discord
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="auth-box bg-zinc-950/90 p-8 rounded-2xl backdrop-blur-md max-w-md w-full border border-zinc-900">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-6">
            Akses Ditolak
          </h2>
          <p className="text-gray-400 mb-6">
            Anda tidak memiliki akses ke halaman ini. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
          <div className="flex gap-4">
            <AccessButton />
            <button
              onClick={() => signOut()}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black">
      <div className="relative z-10">
        <div className="container mx-auto px-3 pt-0 pb-0">
          {/* Judul global */}

          {/* ...existing content dari renderContent... */}
          <div className="mb-6 mt-0">
            <div className="p-2 md:p-6 rounded-xl transition-all duration-300 relative overflow-visible" style={{marginTop: '-35px', background: 'transparent'}}>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="w-full order-1 mb-3 md:mb-0 md:order-1 md:w-1/2 flex flex-col justify-center">
                  <h1 className="hidden md:block text-xl md:text-5xl font-bold text-white leading-tight">
                    The Art of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Crypto Trading</span>
                  </h1>
                  <div className="hidden md:flex gap-2 mt-3">
                    <a href={links.startLearning} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-white text-black text-base font-semibold rounded-lg hover:opacity-90 transition-all duration-300">
                      <FaPlay />
                      Tonton
                    </a>
                    <a href={links.moreInfo} className="flex items-center justify-center px-4 py-2 border-gray-700 text-white text-base font-medium rounded-lg hover:bg-purple-500/10 transition-all duration-300">
                      Selengkapnya
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-2 order-2 md:order-2 flex flex-col items-center md:items-end">
                  <div className="relative group border border-gray-800/30 rounded-xl overflow-hidden w-full max-w-xl">
                    <img
                      src="/images/art-of-crypto-trading.jpg"
                      alt="The Art of Crypto Trading"
                      className="w-full h-auto max-h-[480px] mt-0 md:mt-8"
                      style={{ display: 'block' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 md:hidden gap-2 w-full">
                    <a href={links.startLearning} className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-white to-white text-black text-sm font-semibold rounded-lg">
                      <FaPlay className="text-xs" />
                      Tonton
                    </a>
                    <a href={links.moreInfo} className="flex items-center justify-center px-3 py-2 border border-gray-700 text-white text-sm font-medium rounded-lg">
                      Selengkapnya
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 md:mt-8">
            <AllClassesPage />
          </div>
          <div className="mt-2 md:mt-8">
            <TradingPage />
          </div>
          <div className="mt-2 md:mt-8">
            <InvestingPage />
          </div>
          <div className="mt-2 md:mt-8">
            <BlockchainPage />
          </div>
          <div className="mt-2 md:mt-8">
            <LiveclassPage />
          </div>
        </div>
      </div>
    </div>
  );
}
