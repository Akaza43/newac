"use client";

import React, { useState } from "react";
import { IoArrowForwardOutline } from "react-icons/io5";
import { GridItem } from "@/app/menu/komunitas/page";

export const ReusableGrid: React.FC<{ data: GridItem[] }> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);

  const handleContainerClick = (item: GridItem) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-white/[0.02] via-black/90 to-black/95 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer border border-gray-800/40 flex flex-col justify-between"
              onClick={() => handleContainerClick(item)}
            >
              <div>
                <img
                  src={`/images/${item.img}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between h-48">
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{item.description}</p>
                  </div>
                  {item.price && (
                    <div className="mt-4">
                      {item.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">{item.price}</span>
                          <span className="text-sm text-green-400 font-semibold">{item.discountPrice}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">{item.price}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                  <span>Get Access</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-3xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 border border-purple-500" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-purple-500 rounded"></div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">{selectedItem.title}</h3>
            <p className="text-sm text-gray-400 mb-4 text-center">{selectedItem.description}</p>
            {selectedItem.price && (
              <div className="text-center mb-6">
                {selectedItem.discountPrice ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-400 line-through">{selectedItem.price}</span>
                    <span className="text-lg text-green-400 font-semibold">{selectedItem.discountPrice}</span>
                  </div>
                ) : (
                  <span className="text-lg text-gray-400">{selectedItem.price}</span>
                )}
              </div>
            )}
            <div className="space-y-4">
              {selectedItem.buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => window.open(button.link, "_blank")}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg text-center font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    <IoArrowForwardOutline className="h-5 w-5" />
                    {button.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={closePopup}
              className="mt-6 w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};