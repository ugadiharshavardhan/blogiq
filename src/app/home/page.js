"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BlogCard from "@/app/components/BlogCard";

import SkeletonLoader from "@/app/components/SkeletonLoader";

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching global trending news...");
                // Fetch without category param to trigger default "latest world news" in API
                const response = await fetch(`/api/news`);
                const data = await response.json();
                console.log("Global News Data:", data);
                setArticles(data.articles || []);
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

    return (
        <div className="min-h-screen">
            <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    {getGreeting()}, <span className="text-indigo-600">{user?.firstName || "Guest"}</span>
                </h2>
                <h1 className="text-lg text-gray-500 font-medium mb-3">
                    Global Trending News
                </h1>
                <p className="text-lg text-gray-500">
                    Stay updated with the latest stories from around the world.
                </p>
            </div>

            {loading ? (
                <SkeletonLoader />
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <BlogCard key={index} blog={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg">
                        No trending news found at the moment.
                    </p>
                </div>
            )}
        </div>
    );
}
