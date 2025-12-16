"use client";

import { motion } from "framer-motion";

interface FooterProps {
  lastUpdated: number | null;
  isConnected: boolean;
}

export default function Footer({ lastUpdated, isConnected }: FooterProps) {
  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="px-10 border-t-2 border-gray-200 pt-6 pb-8 bg-white backdrop-blur-sm rounded-t-2xl"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-sm">
        <motion.div
          className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <svg
            className="w-5 h-5 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            Last updated:{" "}
            <motion.span
              key={lastUpdated}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-blue-700"
            >
              {formatTimestamp(lastUpdated)}
            </motion.span>
          </span>
        </motion.div>

        <motion.div
          className={`flex items-center space-x-3 px-4 py-2 rounded-full ${
            isConnected ? "bg-green-50" : "bg-orange-50"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2.5 h-2.5 rounded-full shadow-lg ${
              isConnected
                ? "bg-green-900 shadow-green-900/50"
                : "bg-orange-600 shadow-orange-600/50"
            }`}
          />
          <span className="text-gray-700 font-medium">
            Device Status:{" "}
            <span
              className={`font-bold ${
                isConnected ? "text-green-900" : "text-orange-600"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </span>
        </motion.div>

        <div className="text-gray-500 font-semibold">© 2025 EcoTrack AI</div>
      </div>
    </motion.footer>
  );
}
