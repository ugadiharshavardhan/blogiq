"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import BlogCard from "@/app/components/BlogCard";

import SkeletonLoader from "@/app/components/SkeletonLoader";

export default function CategoryPage({ params }) {
  const { category } = use(params);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching news for category:", category);
        const response = await fetch(`/api/news?category=${category}`);
        const data = await response.json();
        console.log("API Response Data:", data);
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

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
          {capitalize(category)} Insights
        </h1>
        <p className="text-lg text-gray-500">
          Explore the latest stories and AI-powered summaries in {category}.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <BlogCard key={index} blog={article} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">
            No blogs found in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
