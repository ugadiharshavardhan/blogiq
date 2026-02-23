"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BlogCard from "@/app/components/BlogCard";
import SearchBar from "@/app/components/SearchBar";
import SkeletonLoader from "@/app/components/SkeletonLoader";

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const CACHE_KEY = "global_news_cache";
        // ... (rest of useEffect content is identical)
        const ONE_HOUR = 3600000;

        const fetchData = async (force = false) => {
            try {
                // Check cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (!force && cachedData) {
                    const { articles: cachedArticles, timestamp } = JSON.parse(cachedData);
                    const now = new Date().getTime();

                    if (now - timestamp < ONE_HOUR) {
                        console.log("Using cached global news (cache holds for 1 hour)");
                        setArticles(cachedArticles);
                        setLoading(false);
                        return;
                    }
                }

                console.log("Fetching fresh global news (cache expired or missing)");
                const response = await fetch(`/api/news`);
                const data = await response.json();
                const freshArticles = data.articles || [];

                setArticles(freshArticles);
                console.log(freshArticles)

                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    articles: freshArticles,
                    timestamp: new Date().getTime()
                }));
            } catch (error) {
                console.error("Error fetching global news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { user } = useUser();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const filteredArticles = articles.filter(article => {
        const searchLower = searchQuery.toLowerCase();
        return (
            article.title?.toLowerCase().includes(searchLower) ||
            article.description?.toLowerCase().includes(searchLower) ||
            article.content?.toLowerCase().includes(searchLower) ||
            article.author?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                    {getGreeting()}, <span className="text-indigo-600 dark:text-indigo-400">{user?.firstName || "Guest"}</span>
                </h2>
                <h1 className="text-lg text-gray-400 font-medium mb-6 uppercase tracking-[0.2em]">
                    Global Trending News
                </h1>

                <SearchBar
                    initialQuery={searchQuery}
                    onSearch={(query) => setSearchQuery(query)}
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
            ) : filteredArticles.length > 0 ? (
                <>
                    {searchQuery && (
                        <p className="mb-8 text-gray-500 dark:text-gray-400 font-medium italic">
                            Showing {filteredArticles.length} results for "{searchQuery}"
                        </p>
                    )}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 md:space-y-0">
                        {filteredArticles.map((article, index) => (
                            <div key={index} className="break-inside-avoid mb-6">
                                <BlogCard blog={article} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-2">
                        {searchQuery ? `No matches found for "${searchQuery}"` : "No trending news found"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                        {searchQuery ? "Try searching for something else or clear the search to see all news." : "Check back later for more updates."}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
