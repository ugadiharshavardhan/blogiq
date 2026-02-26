"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[90vh] bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 flex items-center justify-center p-6 selection:bg-rose-500/30 overflow-hidden font-sans relative">

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">

                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:order-1"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-8 border border-rose-200/50 dark:border-rose-500/20 shadow-sm">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>System Error</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400">
                        Something went wrong!
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                        We encountered an unexpected glitch while trying to process your request. Our systems have logged the issue.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full">
                        <button
                            onClick={() => reset()}
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>

                        <Link href="/" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl font-semibold text-base shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer">
                                <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Return Home
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Image Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                    className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 lg:order-2"
                >
                    <img
                        src="https://images.unsplash.com/photo-1555861496-faa643194a20?auto=format&fit=crop&q=80&w=1200"
                        alt="Broken connection or error"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </motion.div>

            </div>
        </div>
    );
}
