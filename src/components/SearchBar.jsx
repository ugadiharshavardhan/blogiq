"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchBar = ({ initialQuery, onSearch, placeholder = "Search articles...", articles = [] }) => {
    const [localQuery, setLocalQuery] = useState(initialQuery || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (localQuery.trim().length > 1 && articles.length > 0) {
            const searchLower = localQuery.toLowerCase();
            const filtered = articles.filter(article =>
                article.title?.toLowerCase().includes(searchLower) ||
                article.description?.toLowerCase().includes(searchLower)
            ).slice(0, 6);
            setSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [localQuery, articles]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(localQuery);
        setShowDropdown(false);
    };

    const handleClear = () => {
        setLocalQuery("");
        onSearch("");
        setShowDropdown(false);
    };

    const handleSuggestionClick = (article) => {
        const slug = article.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || 'article';

        localStorage.setItem("selectedBlog", JSON.stringify(article));
        router.push(`/blog/${slug}/details/${article.id}`);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto mb-10 group" ref={dropdownRef}>
            <form
                onSubmit={handleSubmit}
                className="relative transition-all duration-300"
            >
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 group-focus-within:shadow-lg group-focus-within:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                            className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        type="text"
                        placeholder={placeholder}
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onFocus={() => localQuery.trim().length > 1 && setShowDropdown(true)}
                        className="block w-full pl-10 pr-20 py-3 bg-transparent border-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 text-sm font-medium"
                    />

                    <div className="absolute inset-y-0 right-0 p-1 flex items-center gap-1">
                        {localQuery && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-all"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        <button
                            type="submit"
                            className="h-full px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-xs hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all active:scale-95"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="mt-2.5 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-gray-600">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-[8px]">ENTER</kbd>
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
                    <span>TO SEARCH</span>
                </div>
            </form>
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        {suggestions.map((article, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(article)}
                                className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 flex items-start gap-3 transition-colors group/item"
                            >
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex-shrink-0 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 group-hover/item:bg-indigo-600 transition-colors">
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover/item:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate mb-0.5 leading-tight">
                                        {article.title}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                        {article.source?.name || "Global News"}
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            Quick Suggestions
                        </span>
                        <div className="flex gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                            <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-50"></span>
                            <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-20"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
