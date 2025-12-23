"use client";

import Image from 'next/image';
import { useState } from 'react';
import { tradingData } from '../1-trading/data';
import { investingData } from '../2-investing/data';
import { blockchainData } from '../3-blockchain/data';
import { liveclassData } from '../4-liveclass/data';

export default function AllClassesPage() {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

  // Gabungkan semua data modul
  const allClasses = [
    ...liveclassData,
    ...tradingData,
    ...investingData,
    ...blockchainData,
  ];

  function handleImageError(title: string) {
    setImgError((prev) => ({ ...prev, [title]: true }));
  }

  return (
    <div>
      <h1 className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-6">
        All Classes
      </h1>
      <div className="flex gap-2 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {allClasses.map((item, index) => (
          <a
            key={index}
            href={item.link}
            rel="noopener noreferrer"
            className="flex-shrink-0 overflow-hidden hover:scale-[1.02] transition-transform rounded-lg md:rounded-xl w-[176px] md:w-[320px]"
          >
            <div className="aspect-video relative rounded-md md:rounded-lg overflow-hidden">
              {imgError[item.title] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-[8px] md:text-base text-gray-400">{item.title}</span>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 176px, 320px"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(item.title)}
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}