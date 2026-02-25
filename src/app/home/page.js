"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BlogCard from "@/components/BlogCard";
import SearchBar from "@/components/SearchBar";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useUser();

    useEffect(() => {
        const CACHE_KEY = "global_news_cache_v2";
        const CACHE_TIME = 300000; // 5 minutes

        const fetchData = async (force = false) => {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (!force && cached) {
                    const { articles: cachedArticles, timestamp } = JSON.parse(cached);
                    if (new Date().getTime() - timestamp < CACHE_TIME) {
                        setArticles(cachedArticles);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(`/api/news`);
                const data = await response.json();
                const fresh = data.articles || [];

                setArticles(fresh);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    articles: fresh,
                    timestamp: new Date().getTime()
                }));
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const filtered = articles.filter(article => {
        const query = searchQuery.toLowerCase();
        return (
            article.title?.toLowerCase().includes(query) ||
            article.description?.toLowerCase().includes(query) ||
            article.author?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen">
            <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                    {greeting()}, <span className="text-indigo-600 dark:text-indigo-400">{user?.firstName || "Guest"}</span>
                </h2>
                <h1 className="text-lg text-gray-400 font-medium mb-6 uppercase tracking-[0.2em]">
                    Global Trending News
                </h1>

                <SearchBar
                    initialQuery={searchQuery}
                    onSearch={setSearchQuery}
                    placeholder="Search global trending stories..."
                    articles={articles}
                />

                {!searchQuery && (
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest stories from around the world.
                    </p>
                )}
            </div>

            {loading ? (
                <SkeletonLoader />
            ) : filtered.length > 0 ? (
                <>
                    {searchQuery && (
                        <p className="mb-8 text-gray-500 dark:text-gray-400 font-medium italic">
                            Showing {filtered.length} results for "{searchQuery}"
                        </p>
                    )}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 md:space-y-0">
                        {filtered.map((article, index) => (
                            <div key={index} className="break-inside-avoid mb-6">
                                <BlogCard blog={article} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-2">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "No trending news found"}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
