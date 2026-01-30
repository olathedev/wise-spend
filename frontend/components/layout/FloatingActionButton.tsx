"use client";

import React from "react";
import Link from "next/link";

interface FloatingActionButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function FloatingActionButton({
  onClick,
  href,
  className = "",
}: FloatingActionButtonProps) {
  const content = (
    <>
      <span className="material-icons-round text-3xl">bubble_chart</span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 border-2 border-white dark:border-slate-900"></span>
      </span>
    </>
  );

  const defaultClassName =
    "fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-teal-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 animate-bounce-slow";

  const combinedClassName = `${defaultClassName} ${className}`.trim();

  if (onClick) {
    return (
      <button onClick={onClick} className={combinedClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "/dashboard/ai-coach"} className={combinedClassName}>
      {content}
    </Link>
  );
}
