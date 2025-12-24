"use client";

import Image from "next/image";

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 animate-slideInRight">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 flex items-center justify-center rounded-lg">
              <Image
                src="/logo.png"
                alt="EcoTrack AI Logo"
                width={44}
                height={44}
                className="w-10 h-10 sm:w-11 sm:h-11"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                EcoTrack AI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block truncate">
                Environment Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline
                    ? "bg-emerald-500 animate-pulse-subtle"
                    : "bg-gray-400"
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
