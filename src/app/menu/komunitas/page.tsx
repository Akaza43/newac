"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ReusableGrid } from "@/components/ReusableGrid";

export interface GridItem {
  img: string;
  title: string;
  description: string;
  price?: string;
  discountPrice?: string;
  buttons: { name: string; link: string }[];
}

const komunitasData: GridItem[] = [
  {
    img: "CSV.png",
    title: "TRIAL 24 JAM",
    description: "coba seluruh konten kami selama 24 jam.",
    price: "Free",
    discountPrice: "",
    buttons: [
      { name: "Get Trial", link: "https://discord.gg/e33N6Xap74" },
    ],
  },
  {
    img: "CSV.png",
    title: "AKSES SEUMUR HIDUP",
    description: "Dapatkan akses seumur hidup ke semua konten",
    price: "Rp 1.200.000",
    discountPrice: "Rp 600.000",
    buttons: [
      { name: "BUY NOW!", link: "https://lynk.id/acforall" },
    ],
  },
 
  {
    img: "CSV.png",
    title: "AKSES 1 TAHUN",
    description: "Dapatkan akses ke semua konten kami selama 1 tahun.",
    price: "Rp 300.000",
    discountPrice: "Rp 150.000",
    buttons: [
      { name: "BUY NOW!", link: "https://lynk.id/acforall" },
    ],
  },

   {
    img: "CSV.png",
    title: "AKSES 3 BULAN",
    description: "Dapatkan akses ke semua konten kami selama 3 bulan.",
    price: "Rp 170.000",
    discountPrice: "Rp 85.000",
    buttons: [
      { name: "BUY NOW!", link: "https://lynk.id/acforall" },
    ],
  },

  {
    img: "CSV.png",
    title: "AKSES 1 BULAN",
    description: "Dapatkan akses ke semua konten kami selama 1 bulan.",
    price: "Rp 120.000",
    discountPrice: "Rp 60.000",
    buttons: [
      { name: "BUY NOW!", link: "https://lynk.id/acforall" },
    ],
  },
];

export default function KomunitasPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8 text-center pt-8">
          JOIN AC FOR ALL NOW!
          <div className="mt-2 w-16 h-1 mx-auto bg-purple-500 rounded" />
        </h1>

        <ReusableGrid data={komunitasData} />
      </div>
    </div>
  );
}
