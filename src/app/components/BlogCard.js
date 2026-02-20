"use client";

import { useState } from "react";

export default function BlogCard({ blog, category }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Use passed category or fallback to blog.category or "General"
    const displayCategory = category || blog.category || "General";

    // Simulated AI Summary Generator
    const handleSummarize = async () => {
        if (summary) {
            setExpanded(!expanded);
            return;
        }

        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock summary generation based on content
        const mockSummary = `✨ AI Summary: This article discusses ${blog.title?.toLowerCase() || "this topic"} and its impact on the ${displayCategory} sector. Key points include the rapid evolution of trends, the importance of adaptation, and future projections.`;

        setSummary(mockSummary);
        setLoading(false);
        setExpanded(true);
    };


    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
            <div className="h-48 bg-gray-100 relative overflow-hidden group">
                {/* Image or Placeholder Gradient */}
                {blog.urlToImage ? (
                    <img
                        src={blog.urlToImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.onerror = null;
                            e.target.style.display = 'none'; // Hide broken image
                            e.target.nextSibling.style.display = 'block'; // Show gradient fallback
                        }}
                    />
                ) : null}

                {/* Fallback Gradient (shown if no image or image fails) */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${getGradient(displayCategory)} opacity-80 group-hover:scale-105 transition-transform duration-500`}
                    style={{ display: blog.urlToImage ? 'none' : 'block' }}
                ></div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-wide shadow-sm z-10">
                    {displayCategory}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {blog.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="text-xs text-gray-400 font-medium">
                        <span>{blog.author || blog.source?.name || "Unknown Author"}</span> • <span>{blog.readTime || "5 min read"}</span>
                    </div>
                    <button
                        onClick={handleSummarize}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                                Summarizing...
                            </>
                        ) : (
                            <>
                                <span>✨</span> {summary ? (expanded ? "Hide Summary" : "Show Summary") : "Summarize"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Summary Section */}
            {expanded && summary && (
                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {summary}
                        </p>
                    </div>
                </div>
            )}
        </div>
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
        default: return 'from-gray-400 to-gray-500';
    }
}
