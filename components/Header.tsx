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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-linear-to-br from-green-900 to-blue-700 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="EcoTrack AI Logo"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900">EcoTrack AI</h1>
              <p className="text-xs text-gray-500 font-medium">
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                isOnline
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : "bg-orange-50 text-orange-600 border border-orange-200"
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                  isOnline
                    ? "bg-green-900 shadow-green-900/50"
                    : "bg-orange-600 shadow-orange-600/50"
                }`}
              />
              <span>{isOnline ? "Live" : "Offline"}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
