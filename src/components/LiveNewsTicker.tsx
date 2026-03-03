import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { db } from "../lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Bell, X } from "lucide-react";

export default function LiveNewsTicker() {
  const [news, setNews] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        const q = query(collection(db, "live_news"));
        const snap = await getDocs(q);
        const activeNews = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any))
          .filter((n: any) => n.isActive === true)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNews(activeNews);
      } catch (err) {
        console.error("Error fetching live news:", err);
      }
    };
    fetchLiveNews();
  }, []);

  if (!isVisible || news.length === 0) return null;

  // Combine all news content into one long string for the marquee
  const marqueeText = news.map(n => n.content).join("   •   ");

  return (
    <div className="w-full bg-white border-b border-emerald-100 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto flex items-center h-10">
        {/* Highlight Badge */}
        <div className="flex items-center gap-2 bg-red-600 text-white px-4 h-full shrink-0 font-bold text-xs tracking-wide relative overflow-hidden">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="whitespace-nowrap">ব্রেকিং নিউজ</span>
        </div>

        {/* Marquee Area */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center bg-emerald-50/30">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex whitespace-nowrap items-center gap-8 px-4"
          >
            <span className="text-emerald-900 font-medium text-sm">
              {marqueeText}
            </span>
            {/* Duplicate for seamless loop */}
            <span className="text-emerald-900 font-medium text-sm">
              {marqueeText}
            </span>
          </motion.div>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="px-3 h-full hover:bg-red-50 hover:text-red-500 text-emerald-400 transition-colors border-l border-emerald-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
