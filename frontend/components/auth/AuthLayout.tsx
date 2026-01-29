'use client';

import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel - Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
                {/* Background Gradients (Subtle) */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black"></div>
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 -right-20 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-8">

                    {/* Floating Card 1 - Savings */}
                    <div className="absolute top-20 right-10 bg-white p-4 rounded-xl shadow-2xl transform rotate-3 animate-float-slow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Monthly Savings</p>
                                <p className="text-sm font-bold text-slate-900">+$1,250.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Central Visual - Dashboard Abstract */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl w-full mb-12">
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="h-40 w-full bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl border border-white/5 relative overflow-hidden group flex items-center justify-center">
                                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-40 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 w-3/4 bg-slate-700/50 rounded animate-pulse"></div>
                                <div className="h-3 w-1/2 bg-slate-700/50 rounded animate-pulse delay-75"></div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card 2 - Insight */}
                    <div className="absolute bottom-32 left-10 bg-white p-4 rounded-xl shadow-2xl transform -rotate-3 animate-float-delayed">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Smart Insight</p>
                                <p className="text-sm font-bold text-slate-900">Dining spend -15%</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Panel - Form (Force Light) */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
