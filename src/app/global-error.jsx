"use client";

import { Home, RefreshCcw, AlertOctagon } from "lucide-react";
import '@/app/globals.css';

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 flex items-center justify-center p-6 selection:bg-red-500/30 overflow-hidden font-sans relative">

                    {/* Background elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-4xl w-full text-center z-10">
                        <div className="mx-auto w-24 h-24 mb-8 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center shadow-lg border border-red-200/50 dark:border-red-500/20">
                            <AlertOctagon className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-400 dark:to-amber-400 leading-tight">
                            Critical Error
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            A severe application error occurred. We apologize for the interruption to your experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                            <button
                                onClick={() => reset()}
                                className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center gap-3 cursor-pointer group"
                            >
                                <RefreshCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
                                Reload Application
                            </button>

                            <a href="/">
                                <button className="px-10 py-5 bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-lg shadow-md transition-all active:scale-95 flex items-center gap-3 cursor-pointer group">
                                    <Home className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                                    Main Page
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
