"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function BlogDetailsInteractive({ serverBlog, paramId }) {
    const [blog, setBlog] = useState(serverBlog);
    const [isBookmarked, setIsBookmarked] = useState(false);

    
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isStreamFinished, setIsStreamFinished] = useState(false);
    const [targetText, setTargetText] = useState("");
    const [summaryResult, setSummaryResult] = useState("");
    const [summaryType, setSummaryType] = useState("bullets");
    const [summaryError, setSummaryError] = useState("");

    
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        
        if (targetText.length > summaryResult.length) {
            const timeout = setTimeout(() => {
                const nextChunk = targetText.slice(0, summaryResult.length + 3);
                setSummaryResult(nextChunk);
            }, 10);
            return () => clearTimeout(timeout);
        } else if (isStreamFinished && targetText.length === summaryResult.length && isSummarizing) {
            setIsSummarizing(false);
        }
    }, [targetText, summaryResult, isStreamFinished, isSummarizing]);

    useEffect(() => {
        
        let currentBlog = serverBlog;

        if (!currentBlog) {
            const stored = localStorage.getItem("selectedBlog");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.id === paramId || parsed._id === paramId) {
                    currentBlog = parsed;
                    setBlog(parsed);
                }
            }
        }

        
        if (currentBlog) {
            fetch("/api/bookmarks")
                .then(res => res.ok ? res.json() : [])
                .then(bookmarks => {
                    if (Array.isArray(bookmarks)) {
                        setIsBookmarked(bookmarks.some(b => b.blogId === (currentBlog.id || currentBlog._id)));
                    }
                })
                .catch(() => { });
        }
        window.scrollTo(0, 0);
    }, [serverBlog, paramId]);

    const handleSummarize = async () => {
        if (!blog?.id && !blog?._id) return;
        if (!blog?.content && !blog?.url) return;

        setIsSummarizing(true);
        setIsStreamFinished(false);
        setSummaryError("");
        setSummaryResult("");
        setTargetText("");

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blogId: blog.id || blog._id,
                    url: blog.url,
                    content: blog.content,
                    type: summaryType
                }),
            });

            if (!res.ok) {
                let errData;
                try { errData = await res.json(); } catch (e) { }
                throw new Error(errData?.error || "Failed to generate summary");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunkText = decoder.decode(value, { stream: true });
                    setTargetText(prev => prev + chunkText);
                }
            }
            setIsStreamFinished(true);
        } catch (err) {
            setSummaryError(err.message || "An unexpected error occurred.");
            setIsSummarizing(false);
            setIsStreamFinished(true);
        }
    };

    const toggleBookmark = async () => {
        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blog),
            });

            if (res.ok) {
                const data = await res.json();
                setIsBookmarked(data.isBookmarked);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-800 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-gray-400 tracking-wide uppercase">Preparing Story</p>
                </div>
            </div>
        );
    }

    const formattedDate = formatDate(blog.publishedAt || blog.createdAt);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-indigo-50 dark:selection:bg-indigo-900 transition-colors duration-300">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50 transition-colors duration-300"
                style={{ scaleX }}
            />

            <header className="fixed top-0 inset-x-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-40 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-8 lg:px-12 justify-between transition-colors duration-300">
                <Link
                    href={blog.fromCreator ? "/dashboard" : "/home"}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-bold tracking-tight">{blog.fromCreator ? "Back to Dashboard" : "Back to Library"}</span>
                </Link>

                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    {!blog.fromCreator && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleBookmark}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${isBookmarked
                                ? "bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none"
                                : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-800"
                                }`}
                            title={isBookmarked ? "Remove from bookmarks" : "Save to library"}
                        >
                            <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </motion.button>
                    )}

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
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest hidden sm:block">REF.{(blog.id || blog._id || "").slice(-4).toUpperCase()}</span>
                </div>
            </header>

            <main className="pt-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
                        <div className="lg:col-span-3">
                            <article>
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

                                <div className="max-w-3xl">
                                    <div className="font-serif text-[1.25rem] md:text-[1.35rem] leading-[1.8] text-gray-800 dark:text-gray-200 rich-text-content mb-16">
                                        {blog.content ? (
                                            <div className="relative">
                                                <div
                                                    className="editorial-body dark:text-gray-200"
                                                    dangerouslySetInnerHTML={{ __html: blog.isInternal ? blog.content : blog.content.split('[+')[0] }}
                                                />

                                                {!blog.isInternal && (
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
                                                )}
                                            </div>
                                        ) : (
                                            <div className="py-12 px-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                                <p className="text-gray-400 dark:text-gray-500 italic font-sans italic">The content preview for this article is currently unavailable. Please visit the original publisher to read the story.</p>
                                                <a href={blog.url} className="mt-6 inline-block font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Go to Original Website →</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {(blog.content || blog.url) && (
                                    <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
                                        <div className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-gray-900 rounded-3xl p-8 md:p-10 border border-indigo-100/50 dark:border-indigo-500/10 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

                                            <div className="flex items-center space-x-3 mb-8 relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold font-sans text-gray-900 dark:text-white tracking-tight">AI Summary</h3>
                                                    <p className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mt-1">Powered by BlogIQ Brain</p>
                                                </div>
                                            </div>

                                            {!summaryResult ? (
                                                <div className="relative z-10">
                                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 font-sans">
                                                        Too long? Get a quick AI-generated summary tailored to your reading preference.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
                                                        {['short', 'bullets', 'technical'].map((type) => (
                                                            <button
                                                                key={type}
                                                                onClick={() => setSummaryType(type)}
                                                                className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${summaryType === type
                                                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-900"
                                                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                    }`}
                                                            >
                                                                {type === 'short' ? 'Brief' : type}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {summaryError && (
                                                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center font-sans">
                                                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {summaryError}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={handleSummarize}
                                                        disabled={isSummarizing}
                                                        className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm md:text-base tracking-wide hover:bg-black dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-200 dark:shadow-none hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                                                    >
                                                        {isSummarizing ? (
                                                            <>
                                                                <div className="w-5 h-5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin mr-3"></div>
                                                                Analyzing Content...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Generate Summary
                                                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative z-10 animate-fade-in-up">
                                                    <div className="prose prose-indigo dark:prose-invert max-w-none mb-8 text-gray-800 dark:text-gray-200 font-sans leading-relaxed text-base md:text-lg">
                                                        {summaryType === 'bullets' && summaryResult.includes('-') ? (
                                                            <ul className="space-y-4 list-none p-0 m-0">
                                                                {summaryResult.split(/(?:•|-|\*)\s*/).filter(item => item.trim() && item.trim().length > 3).map((point, index) => (
                                                                    <li key={index} className="flex items-start bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                                                                        <span className="text-indigo-500 mr-4 mt-1 min-w-[16px]">
                                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                                        </span>
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{point.trim().replace(/^[\.\s]+/, '')}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="m-0 bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl font-serif leading-loose border border-gray-100 dark:border-gray-800">
                                                                {summaryResult}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between pt-6 border-t border-indigo-100 dark:border-gray-800">
                                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] flex items-center">
                                                            {isSummarizing ? (
                                                                <>
                                                                    <div className="w-2 h-2 rounded-full border border-indigo-500 border-t-transparent animate-spin mr-2"></div>
                                                                    Generating text...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                                                    Generation Complete
                                                                </>
                                                            )}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setSummaryResult("");
                                                                setTargetText("");
                                                                setIsSummarizing(false);
                                                                setIsStreamFinished(false);
                                                            }}
                                                            className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </article>
                        </div>

                        <aside className="hidden lg:block">
                            <div className="sticky top-24">
                                <Sidebar />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <footer className="py-16 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3 grayscale opacity-40 dark:opacity-20">
                        <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src="/logo.png" alt="BlogIQ Logo" className="w-full h-full object-cover" />
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
