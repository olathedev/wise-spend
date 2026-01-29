'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SnapReceiptButtonProps {
  onFileSelect?: (file: File) => void;
}

const SnapReceiptButton: React.FC<SnapReceiptButtonProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || '';
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || hasTouchScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsProcessing(true);
    
    try {
      if (onFileSelect) {
        await onFileSelect(file);
      } else {
        // Default behavior - you can add your upload logic here
        console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
        // Simulate processing/upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        // You can add actual upload logic here
        // await uploadReceipt(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-teal-200 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
          {isProcessing ? (
            <span className="material-icons-round text-3xl animate-spin">hourglass_empty</span>
          ) : (
            <span className="material-icons-round text-3xl">add</span>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-teal-700 dark:text-teal-400">Snap Receipt</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-teal-600/60 dark:text-teal-400/60">
            {isProcessing 
              ? 'Processing...' 
              : isMobile 
                ? 'Tap to capture or upload' 
                : 'Add New Expense'}
          </p>
        </div>
      </button>
      
      {/* Hidden file input */}
      {/* capture="environment" enables camera on mobile, file picker on desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label={isMobile ? 'Capture or upload receipt image' : 'Upload receipt image'}
      />
    </>
  );
};

export default SnapReceiptButton;
