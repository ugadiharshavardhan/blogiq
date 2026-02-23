"use client";

import { useState } from "react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogCard({ blog, category }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [copied, setCopied] = useState(false);
    const displayCategory = category || blog.category || "General";

    // Clean Title: remove source name if at the end (common in news APIs)
    const cleanTitle = blog.title?.replace(/ - [^-]+$/, "") || "";

    const slug = blog.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'article';

    const handleReadMore = () => {
        localStorage.setItem("selectedBlog", JSON.stringify(blog));
    };

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = `${window.location.origin}/blog/${slug}/details/${blog.id}`;
        const shareData = {
            title: cleanTitle,
            text: blog.description,
            url: shareUrl,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.warn("Share failed:", err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col"
        >
            {/* Feedback Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -10, x: "-50%" }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full text-[10px] font-bold shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Link Copied</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/3]">
                {/* Category Overlay */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.1em] text-indigo-600 dark:text-indigo-400 shadow-sm">
                        {displayCategory}
                    </span>
                </div>

                {/* Main Image */}
                {blog.urlToImage && !imageError ? (
                    <img
                        src={blog.urlToImage}
                        alt={blog.title}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(displayCategory)} opacity-10 flex items-center justify-center`}>
                        <span className="text-4xl font-bold text-gray-200 dark:text-gray-700 uppercase">{displayCategory.charAt(0)}</span>
                    </div>
                )}

                {/* Gradient Overlay for better text separation if needed (optional) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {blog.source?.name || "Global News"}
                    </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-[1.3] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 decoration-indigo-600/30 underline-offset-4 decoration-2">
                    {cleanTitle}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 font-medium opacity-80">
                    {blog.description}
                </p>

                <div className="mt-auto space-y-6">
                    {/* Meta info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400">
                                {blog.author?.charAt(0) || blog.source?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                    {blog.author || "Editorial Staff"}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 lowercase">
                                    {formatDate(blog.publishedAt)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-1.5">
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                                title="Share Article"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <Link href={`/blog/${slug}/details/${blog.id}`} className="block">
                        <button
                            onClick={handleReadMore}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 cursor-pointer rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-[0.98] shadow-lg shadow-gray-200 dark:shadow-none hover:shadow-indigo-200"
                        >
                            <span>Read Article</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function getGradient(category) {
    if (!category) return 'from-gray-400 to-gray-500';
    switch (category.toLowerCase()) {
        case 'business': return 'from-blue-400 to-indigo-500';
        case 'technology': return 'from-purple-400 to-pink-500';
        case 'sports': return 'from-orange-400 to-red-500';
        case 'entertainment': return 'from-pink-400 to-rose-500';
        case 'health': return 'from-teal-400 to-emerald-500';
        case 'science': return 'from-cyan-400 to-blue-500';
        default: return 'from-indigo-400 to-purple-500';
    }
}
