"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Sidebar from "@/app/components/Sidebar";

export default function HomeLayout({ children }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const categories = [
        { name: "Trending", href: "/home" },
        { name: "Business", href: "/home/business" },
        { name: "Technology", href: "/home/technology" },
        { name: "Sports", href: "/home/sports" },
        { name: "Entertainment", href: "/home/entertainment" },
        { name: "Health", href: "/home/health" },
        { name: "Science", href: "/home/science" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 relative">

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/home" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">B</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                                    Blogify<span className="text-indigo-600">.AI</span>
                                </span>
                            </Link>
                        </div>

                        {/* Centered Desktop Nav - HIDDEN as requested for Sidebar driven navigation, or kept as top nav? 
                            User requirement: "Quick links section" in sidebar. 
                            However, user didn't explicitly ask to remove top nav. 
                            I'll keep top nav for now but maybe simplify or keep as is. 
                            Actually, the user requirement says "Clicking a category must change the URL dynamically".
                            The sidebar has categories. I'll leave the top nav as is for redundant navigation or standard UX.
                        */}
                        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {categories.map((item) => {
                                const isActive =
                                    item.href === "/home"
                                        ? pathname === "/home"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative group inline-flex items-center px-1 pt-1 text-sm transition-colors duration-200 ${isActive ? "text-indigo-600 font-bold" : "text-gray-500 font-medium hover:text-gray-900"
                                            }`}
                                    >
                                        {/* Text content */}
                                        {item.name}

                                        {/* Animated Underline */}
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-center transition-transform duration-300 ease-out ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}></span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Side: User Button & Mobile Menu Toggle */}
                        <div className="flex items-center gap-4">
                            <UserButton afterSignOutUrl="/" />

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {/* Icon depending on state */}
                                    {isMobileMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {categories.map((item) => {
                                const isActive =
                                    item.href === "/home"
                                        ? pathname === "/home"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base ${isActive
                                            ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 font-bold"
                                            : "text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Layout */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Side: News Content (Scrollable) */}
                    <div className="lg:col-span-3">
                        {children}
                    </div>

                    {/* Right Side: Sidebar (Sticky) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}
