"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function LocationModal({ onAllow, onDeny, isLoading }) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold mb-2">Enable Location?</h2>
                            <p className="text-indigo-100 font-medium leading-relaxed">
                                We use your location to provide real-time weather updates in your sidebar.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 flex flex-col gap-3">
                        <button
                            onClick={onAllow}
                            disabled={isLoading}
                            className={`w-full py-3.5 px-6 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isLoading
                                    ? "bg-indigo-400 cursor-not-allowed text-white/80"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-0.5"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Detecting Location...
                                </>
                            ) : (
                                "Allow Access"
                            )}
                        </button>
                        <button
                            onClick={onDeny}
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Not Now
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-2 italic">
                            You can change this preference anytime in your browser settings.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

