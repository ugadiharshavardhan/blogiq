"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[90vh] bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 flex items-center justify-center p-6 selection:bg-indigo-500/30 overflow-hidden font-sans relative">

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-8 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Error 404</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Oops!
                    </h1>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        Page Not Found
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                        The knowledge you are looking for seems to have vanished. It might have been moved, deleted, or perhaps it never existed at all.
                    </p>

                    <Link href="/">
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 group cursor-pointer">
                            <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            Return Home
                        </button>
                    </Link>
                </motion.div>

                {/* Image Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                    className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10"
                >
                    <img
                        src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=1200"
                        alt="Lost in space - 404"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

            </div>
        </div>
    );
}
