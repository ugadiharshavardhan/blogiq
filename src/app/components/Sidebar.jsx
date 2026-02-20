"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blogs } from "@/lib/blog-data";

export default function Sidebar() {
    const pathname = usePathname();
    const [categories, setCategories] = useState([]);
    const [weather, setWeather] = useState(null);

    // Calculate category counts from blog-data and add random trending numbers
    useEffect(() => {
        const categoryCounts = blogs.reduce((acc, blog) => {
            acc[blog.category] = (acc[blog.category] || 0) + 1;
            return acc;
        }, {});

        const formattedCategories = Object.entries(categoryCounts).map(
            ([name, count]) => {
                // Generate random trending count
                // 70% chance of being 'k', 30% chance of being simple integer
                const isK = Math.random() > 0.3;
                let displayCount;

                if (isK) {
                    // Generate number between 1.0 and 50.0
                    const num = (Math.random() * 49 + 1).toFixed(1);
                    // Remove .0 if present to look cleaner (e.g. 5.0k -> 5k)
                    displayCount = `${num.replace(/\.0$/, '')}k`;
                } else {
                    // Generate integer between 500 and 999
                    displayCount = Math.floor(Math.random() * 500 + 500).toString();
                }

                return {
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    slug: name,
                    count, // Keep real count for fallback or sorting if needed
                    displayCount,
                };
            }
        );

        setCategories(formattedCategories.sort((a, b) => b.count - a.count));
    }, []);

    // Mock Weather Data Fetch
    useEffect(() => {
        // In a real app, fetch from OpenWeatherMap API
        // For now, we simulate a fetch
        const fetchWeather = () => {
            const mockWeather = {
                temp: 24,
                condition: "Sunny",
                location: "San Francisco",
                icon: "☀️",
            };
            setWeather(mockWeather);
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
        return () => clearInterval(interval);
    }, []);

    const quickLinks = [
        { name: "Bookmarks", href: "/bookmarks" },
        { name: "My Profile", href: "/profile" },
        { name: "Settings", href: "/settings" },
    ];

    return (
        <aside className="space-y-4 sticky top-24 h-fit z-50">
            {/* Weather Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20 text-4xl">
                    {weather?.icon}
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Live Weather</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-0.5">{weather ? `${weather.temp}°C` : "--"}</h3>
                    <p className="font-medium text-sm opacity-90">{weather?.condition}</p>
                    <p className="text-[10px] opacity-75 mt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {weather?.location}
                    </p>
                </div>
            </div>

            {/* Trending Categories */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1.5 mb-3 border-b border-gray-50 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Now</h3>
                </div>

                <div className="space-y-3">
                    {categories.slice(0, 5).map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/home/${cat.slug}`}
                            className="block group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-bold text-sm mb-0 group-hover:text-indigo-600 transition-colors ${pathname === `/home/${cat.slug}` ? "text-indigo-600" : "text-gray-900"
                                        }`}>
                                        #{cat.name}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-medium">
                                        {cat.displayCount} posts
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-gray-300 text-xs">•••</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2 uppercase tracking-wide">Quick Links</h3>
                <div className="space-y-1">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
