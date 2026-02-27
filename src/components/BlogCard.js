"use client";

import { useState } from "react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogCard({ blog, category }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [copied, setCopied] = useState(false);

    const displayCategory = category || blog.category || "General";
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

        const shareUrl = `http://blogiq-theta.vercel.app/blog/${slug}/details/${blog.id}`;

        if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
            try {
                await navigator.share({ title: cleanTitle, url: shareUrl });
            } catch (err) { }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) { }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col"
        >
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -10, x: "-50%" }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full text-[10px] font-bold shadow-xl flex items-center gap-2"
                    >
                        <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Link Copied</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative overflow-hidden aspect-[4/3]">
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.1em] text-indigo-600 dark:text-indigo-400 shadow-sm">
                        {displayCategory}
                    </span>
                </div>

                {blog.urlToImage && !imageError ? (
                    <Image
                        src={`/api/image-proxy?url=${encodeURIComponent(blog.urlToImage)}`}
                        alt={blog.title || "Blog Image"}
                        fill
                        unoptimized={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(displayCategory)} opacity-10 flex items-center justify-center`}>
                        <span className="text-4xl font-bold text-gray-200 dark:text-gray-700 uppercase">{displayCategory[0]}</span>
                    </div>
                )}
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {blog.source?.name || "Global News"}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-[1.3] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cleanTitle}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 font-medium opacity-80">
                    {blog.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                            {blog.author?.[0] || 'U'}
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

                    <button onClick={handleShare} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>

                <Link href={`/blog/${slug}/details/${blog.id}`} className="mt-6">
                    <button
                        onClick={handleReadMore}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all active:scale-[0.98]"
                    >
                        Read Article
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}

function getGradient(category) {
    const gradients = {
        business: 'from-blue-400 to-indigo-500',
        technology: 'from-purple-400 to-pink-500',
        sports: 'from-orange-400 to-red-500',
        entertainment: 'from-pink-400 to-rose-500',
        health: 'from-teal-400 to-emerald-500',
        science: 'from-cyan-400 to-blue-500',
    };
    return gradients[category?.toLowerCase()] || 'from-indigo-400 to-purple-500';
}
