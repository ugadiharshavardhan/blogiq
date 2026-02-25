"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blogs } from "@/lib/blog-data";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import LocationModal from "./LocationModal";

export default function Sidebar() {
    const pathname = usePathname();
    const { user, isSignedIn, isLoaded } = useUser();
    const clerk = useClerk();
    const [categories, setCategories] = useState([]);
    const [weather, setWeather] = useState(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationAllowed, setLocationAllowed] = useState(null); // null: undecided, true: allowed, false: withheld
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "2821101850e0fe14fd269b4c584ac2dd";

    useEffect(() => {
        const fetchCounts = async () => {
            const CACHE_KEY = "category_counts_cache";
            const TWELVE_HOURS = 43200000;

            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { counts, timestamp } = JSON.parse(cached);
                    if (new Date().getTime() - timestamp < TWELVE_HOURS) {
                        updateCategories(counts);
                        return;
                    }
                }
                const res = await fetch("/api/counts");
                const data = await res.json();

                if (data.counts) {
                    updateCategories(data.counts);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        counts: data.counts,
                        timestamp: new Date().getTime()
                    }));
                } else {
                    updateCategories({});
                }
            } catch (err) {
                updateCategories({});
            }
        };

        const updateCategories = (apiCounts) => {
            const categoryList = [
                { name: "Business", slug: "business" },
                { name: "Technology", slug: "technology" },
                { name: "Sports", slug: "sports" },
                { name: "Entertainment", slug: "entertainment" },
                { name: "Health", slug: "health" },
                { name: "Science", slug: "science" }
            ];

            const formatted = categoryList.map(cat => ({
                ...cat,
                displayCount: formatCount(apiCounts[cat.slug] || 0)
            }));

            setCategories(formatted);
        };

        const formatCount = (num) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            return num.toString();
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            sessionStorage.removeItem("location_consent");
            setLocationAllowed(null);
            setShowLocationModal(false);
            setWeather(null);
            return;
        }

        const storedConsent = sessionStorage.getItem("location_consent");

        if (storedConsent === "granted") {
            setLocationAllowed(true);
            setShowLocationModal(false);
        } else if (storedConsent === "denied") {
            setLocationAllowed(false);
            setShowLocationModal(false);
        } else {
            setShowLocationModal(true);
        }
    }, [isSignedIn, isLoaded]);

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const data = await res.json();

            if (data.cod == 200) {
                setWeather({
                    temp: Math.round(data.main.temp),
                    condition: data.weather[0].main,
                    location: data.name,
                    icon: getWeatherIcon(data.weather[0].main),
                });
            }
        } catch (error) {
        }
    };

    const getWeatherIcon = (condition) => {
        const icons = {
            Clear: "☀️",
            Clouds: "☁️",
            Rain: "🌧️",
            Snow: "❄️",
            Thunderstorm: "⛈️",
            Drizzle: "🌦️",
            Mist: "🌫️",
        };
        return icons[condition] || "⛅";
    };

    const handleAllowLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocationLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    sessionStorage.setItem("location_consent", "granted");
                    setLocationAllowed(true);
                    setIsLocationLoading(false);
                    setShowLocationModal(false);
                    fetchWeatherByCoords(latitude, longitude);
                },
                () => {
                    setIsLocationLoading(false);
                    handleDenyLocation();
                }
            );
        } else {
            handleDenyLocation();
        }
    };

    const handleDenyLocation = () => {
        sessionStorage.setItem("location_consent", "denied");
        setLocationAllowed(false);
        setIsLocationLoading(false);
        setShowLocationModal(false);
    };

    useEffect(() => {
        let interval;
        if (locationAllowed === true) {
            const updateWeather = () => {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
                        },
                        (error) => {
                            if (error.code === 1) setLocationAllowed(false);
                        }
                    );
                }
            };

            if (!weather) updateWeather();
            interval = setInterval(updateWeather, 600000);
        }
        return () => interval && clearInterval(interval);
    }, [locationAllowed, weather === null]);

    const quickLinks = [
        { name: "Bookmarks", href: "/bookmarks" },
    ];

    return (
        <>
            <AnimatePresence>
                {showLocationModal && (
                    <LocationModal
                        onAllow={handleAllowLocation}
                        onDeny={handleDenyLocation}
                        isLoading={isLocationLoading}
                    />
                )}
            </AnimatePresence>

            <aside className="space-y-3 sticky top-24 h-fit z-50 max-w-xs transition-all">
                <AnimatePresence>
                    {locationAllowed && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-20 text-4xl">
                                {weather?.icon || "⛅"}
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Live Weather</span>
                                </div>

                                {weather ? (
                                    <>
                                        <h3 className="text-2xl font-bold mb-0.5">{weather.temp}°C</h3>
                                        <p className="font-medium text-sm opacity-90">{weather.condition}</p>
                                        <p className="text-[10px] opacity-75 mt-2 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {weather.location}
                                        </p>
                                    </>
                                ) : (
                                    <div className="py-2">
                                        <p className="text-sm font-medium">Fetching weather...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center gap-1.5 mb-2 border-b border-gray-50 dark:border-gray-800 pb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Now</h3>
                    </div>

                    <div className="space-y-2.5">
                        {categories.slice(0, 6).map((cat, index) => (
                            <Link
                                key={cat.slug}
                                href={`/home/${cat.slug}`}
                                className="block group items-center"
                            >
                                <div className="flex gap-3">
                                    <span className="text-xl font-black text-gray-100 dark:text-gray-800 group-hover:text-indigo-50 dark:group-hover:text-indigo-900 transition-colors">
                                        0{index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm mb-0 transition-colors ${pathname === `/home/${cat.slug}` ? "text-indigo-600" : "text-gray-900 dark:text-gray-100 group-hover:text-indigo-600"
                                            }`}>
                                            {cat.name}
                                        </h4>
                                        <p className="text-[10px] text-indigo-600/70 font-bold uppercase tracking-wider">
                                            {cat.displayCount} articles
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 mb-1.5 border-b border-gray-100 dark:border-gray-800 pb-1.5 uppercase tracking-wide">Quick Links</h3>
                    <div className="space-y-1">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-2 py-1.5 flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                {link.name}
                            </Link>
                        ))}
                        <div
                            onClick={() => clerk.openUserProfile()}
                            className="relative px-2 py-1.5 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}


