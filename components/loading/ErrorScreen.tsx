"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorScreenProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function ErrorScreen({
  title = "出错了",
  subtitle = "加载数据时发生错误",
  onRefresh,
}: ErrorScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
    >
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute w-full h-full border-4 border-red-500 rounded-full border-t-transparent"></div>
        <div className="absolute w-full h-full border-4 border-red-300 rounded-full border-b-transparent"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-8 h-8 bg-red-600 rounded-full"></div>
        </motion.div>
      </motion.div>

      <motion.div
        className="text-red-200 text-xl font-medium mb-2"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {title}
      </motion.div>

      <motion.div className="flex space-x-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-red-400 rounded-full"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="text-red-400 text-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {subtitle}
      </motion.div>

      {onRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="outline"
            className="bg-red-500 hover:bg-red-600 text-white border-red-600"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重新加载
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
