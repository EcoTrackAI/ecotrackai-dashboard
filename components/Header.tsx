"use client";

import Image from "next/image";

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-480 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-800 flex items-center justify-center rounded-lg">
              <Image
                src="/logo.png"
                alt="EcoTrack AI Logo"
                width={56}
                height={56}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                EcoTrack AI
              </h1>
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-500 hidden xs:block truncate">
                Environment Monitoring System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div
              className={`flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md text-[10px] xs:text-xs sm:text-sm md:text-base font-medium border ${
                isOnline
                  ? "bg-gray-50 text-gray-900 border-gray-300"
                  : "bg-gray-50 text-gray-600 border-gray-300"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                  isOnline
                    ? "bg-gray-400"
                    : "bg-gray-600"
                }`}
              />
              <span className="hidden xs:inline whitespace-nowrap">
                {isOnline ? "Live" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
