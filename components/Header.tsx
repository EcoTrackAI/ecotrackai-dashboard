"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-green-900 to-blue-700 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="EcoTrack AI Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-green-900">
                EcoTrack AI
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden xs:block">
                Smart Environment Dashboard
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              animate={isOnline ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md ${
                isOnline
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : "bg-orange-50 text-orange-600 border border-orange-200"
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-lg ${
                  isOnline
                    ? "bg-green-900 shadow-green-900/50"
                    : "bg-orange-600 shadow-orange-600/50"
                }`}
              />
              <span className="hidden xs:inline">
                {isOnline ? "Live" : "Offline"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
