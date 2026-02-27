"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Search, Trash2, Calendar, User, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { removeBookmarkAction } from "@/app/bookmarks/actions";

const BookmarkCard = ({ blog, onDelete }) => {
    const slug = blog.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'article';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 flex flex-col md:flex-row gap-5"
        >
            <div className="relative w-full md:w-40 h-32 md:h-28 flex-shrink-0 overflow-hidden rounded-2xl">
                {blog.urlToImage ? (
                    <img
                        src={`/api/image-proxy?url=${encodeURIComponent(blog.urlToImage)}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                        <span className="text-indigo-200 dark:text-indigo-900 font-bold text-2xl uppercase">{blog.category?.[0] || 'B'}</span>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {blog.category || "General"}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {blog.description}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <User size={10} className="text-indigo-500" />
                        <span className="truncate max-w-[80px]">{blog.author || "Editorial"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <Calendar size={10} />
                        <span>{formatDate(blog.publishedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:pl-4 border-gray-50 dark:border-gray-800">
                <Link
                    href={`/blog/${slug}/details/${blog.blogId}`}
                    onClick={() => {
                        const selectedBlog = { ...blog, id: blog.blogId };
                        localStorage.setItem("selectedBlog", JSON.stringify(selectedBlog));
                    }}
                    className="flex-1 md:flex-none p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 flex items-center justify-center"
                    title="View Full Article"
                >
                    <ExternalLink size={16} />
                </Link>
                <button
                    onClick={() => onDelete(blog)}
                    className="flex-1 md:flex-none p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-all active:scale-95 flex items-center justify-center"
                    title="Remove Bookmark"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default function BookmarksInteractiveArea({ initialBookmarks = [] }) {
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const [tempSearchQuery, setTempSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleDelete = async (blog) => {
        // Optimistic UI update
        const previousBookmarks = [...bookmarks];
        setBookmarks(prev => prev.filter(b => b._id !== blog._id));

        try {
            await removeBookmarkAction(blog.blogId);
        } catch (error) {
            console.error("Failed to delete bookmark:", error);
            // Revert on failure
            setBookmarks(previousBookmarks);
            alert("Failed to remove bookmark. Please try again.");
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(tempSearchQuery);
        }
    };

    const filteredBookmarks = bookmarks.filter((bookmark) => {
        const query = searchQuery.toLowerCase();
        return (
            bookmark.title?.toLowerCase().includes(query) ||
            bookmark.description?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="max-w-3xl mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3 block">Personal Library</span>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                        Saved Stories
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
                        A curated collection of your favorite insights and editorial masterpieces.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
                    <div className="lg:col-span-3">
                        <div className="relative mb-10 group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <Search size={22} strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search library (Press Enter to search)..."
                                value={tempSearchQuery}
                                onChange={(e) => setTempSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white shadow-sm font-medium"
                            />
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {filteredBookmarks.length > 0 ? (
                                    filteredBookmarks.map((bookmark) => (
                                        <BookmarkCard
                                            key={bookmark._id}
                                            blog={bookmark}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm"
                                    >
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="text-gray-300 dark:text-gray-600" size={32} />
                                        </div>
                                        <p className="text-gray-400 dark:text-gray-500 text-lg font-bold">
                                            {searchQuery ? "No stories found in your collection." : "Your library is currently empty."}
                                        </p>
                                        <Link href="/home" className="mt-6 inline-block text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Browse Latest Stories →</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <div className="sticky top-0">
                            <Sidebar />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
