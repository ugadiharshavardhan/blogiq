"use client";

import { useEffect, useState, use } from "react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import Sidebar from "@/app/components/Sidebar";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function BlogDetails({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const [blog, setBlog] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const formattedDate = formatDate(blog?.publishedAt);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const storedBlog = localStorage.getItem("selectedBlog");
        if (storedBlog) {
            const parsedBlog = JSON.parse(storedBlog);
            setBlog(parsedBlog);

            // Check if bookmarked
            const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
            setIsBookmarked(bookmarks.some(b => b.title === parsedBlog.title));
        }
        window.scrollTo(0, 0);
    }, []);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        let newBookmarks;
        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => b.title !== blog.title);
        } else {
            newBookmarks = [...bookmarks, blog];
        }
        localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-gray-400 tracking-wide uppercase">Preparing Story</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-indigo-50 dark:selection:bg-indigo-900 transition-colors duration-300">
            {/* Reading Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50 transition-colors duration-300"
                style={{ scaleX }}
            />

            {/* Navigation Header */}
            <header className="fixed top-0 inset-x-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-40 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-8 lg:px-12 justify-between transition-colors duration-300">
                <Link
                    href="/home"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-bold tracking-tight">Back to Library</span>
                </Link>

                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <button
                        onClick={toggleBookmark}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isBookmarked
                            ? "bg-indigo-600 text-white"
                            : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        title={isBookmarked ? "Remove from bookmarks" : "Bookmark this article"}
                    >
                        <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: blog.title, url: window.location.href });
                            }
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
                        title="Share article"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-1"></div>
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest hidden sm:block">REF.{params.id.slice(-4).toUpperCase()}</span>
                </div>
            </header>

            <main className="pt-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
                        {/* Main Reading Column */}
                        <div className="lg:col-span-3">
                            <article>
                                {/* Editorial Header */}
                                <header className="max-w-3xl mb-12">
                                    <div className="flex items-center space-x-2 mb-6 text-indigo-600 dark:text-indigo-400">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{blog.category || "General"}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800"></span>
                                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{blog.readTime || "5 MIN READ"}</span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-[1.05] mb-8">
                                        {blog.title}
                                    </h1>

                                    <div className="flex items-center space-x-4 pb-8 border-b border-gray-100 dark:border-gray-800">
                                        <div className="w-11 h-11 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center text-sm font-bold uppercase ring-4 ring-gray-50 dark:ring-gray-900">
                                            {(blog.author || "U")[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 dark:text-gray-100">{blog.author || "Editorial Staff"}</span>
                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{formattedDate || "Today"} • Published in {blog.source?.name || "Global News"}</span>
                                        </div>
                                    </div>
                                </header>

                                {/* Featured Image */}
                                {blog.urlToImage && (
                                    <figure className="mb-16">
                                        <div className="aspect-[21/10] bg-gray-50 dark:bg-gray-900/50 overflow-hidden rounded-2xl md:rounded-[2rem]">
                                            <img
                                                src={blog.urlToImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        {blog.description && (
                                            <figcaption className="mt-4 text-sm text-gray-400 dark:text-gray-500 italic max-w-2xl">
                                                {blog.description}
                                            </figcaption>
                                        )}
                                    </figure>
                                )}

                                {/* Article Content Body */}
                                <div className="max-w-3xl">
                                    <div className="font-serif text-[1.25rem] md:text-[1.35rem] leading-[1.8] text-gray-800 dark:text-gray-200 rich-text-content mb-16">
                                        {blog.content ? (
                                            <div className="relative">
                                                <div
                                                    className="editorial-body dark:text-gray-200"
                                                    dangerouslySetInnerHTML={{ __html: blog.content.split('[+')[0] }}
                                                />

                                                {/* Professional "Partial View" Divider */}
                                                <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="w-12 h-0.5 bg-indigo-600 mb-8 mx-auto"></div>
                                                        <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight">This story is only partially available here.</h4>
                                                        <p className="text-gray-500 dark:text-gray-400 text-base font-sans max-w-md mb-10 leading-relaxed">
                                                            To protect creator rights and data integrity, the full interactive experience resides on our partner's official platform.
                                                        </p>

                                                        <a
                                                            href={blog.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group inline-flex items-center px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl hover:shadow-gray-300 transform hover:-translate-y-1"
                                                        >
                                                            Read Full Story on {blog.source?.name || "Original Site"}
                                                            <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </a>

                                                        <span className="mt-6 text-[10px] uppercase font-black tracking-widest text-gray-300 dark:text-gray-600">
                                                            Secure verification by {blog.source?.name || "Publisher"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-12 px-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                                <p className="text-gray-400 dark:text-gray-500 italic font-sans italic">The content preview for this article is currently unavailable. Please visit the original publisher to read the story.</p>
                                                <a href={blog.url} className="mt-6 inline-block font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Go to Original Website →</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24">
                                <Sidebar />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Subtle Editorial Footer */}
            <footer className="py-16 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3 grayscale opacity-40 dark:opacity-20">
                        <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                            <span className="text-white dark:text-gray-900 text-xs font-bold">B</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">BlogIQ Editorial</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase font-bold tracking-[0.2em] text-center md:text-right">
                        All content belongs to its respective publisher. <br className="md:hidden" />© {new Date().getFullYear()} Modern Media Systems.
                    </p>
                </div>
            </footer>
        </div>
    );
}
