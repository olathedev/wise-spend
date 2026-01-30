"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SnapReceiptButtonProps {
  onFileSelect?: (file: File) => void;
}

const SnapReceiptButton: React.FC<SnapReceiptButtonProps> = ({
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || "";
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase(),
        );
      const hasTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || hasTouchScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  // ... rest of the handlers ...
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsProcessing(true);

    try {
      if (onFileSelect) {
        await onFileSelect(file);
      } else {
        console.log(
          "File selected:",
          file.name,
          "Size:",
          file.size,
          "Type:",
          file.type,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process receipt. Please try again.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all group overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Camera size={28} />
            </motion.div>
          ) : (
            <Camera size={28} />
          )}
        </div>

        <div className="text-center relative z-10">
          <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">
            {isProcessing ? "Processing..." : "Snap Receipt"}
          </p>
          <p className="text-[10px] text-white/80 font-medium tracking-wide">
            {isMobile ? "Tap to capture" : "Add New Expense"}
          </p>
        </div>
      </motion.button>

      {/* Hidden file input */}
      {/* capture="environment" enables camera on mobile, file picker on desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label={
          isMobile ? "Capture or upload receipt image" : "Upload receipt image"
        }
      />
    </>
  );
};

export default SnapReceiptButton;
