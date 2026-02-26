"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="BlogIQ Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
                BlogIQ
              </span>
            </Link>
          </div>

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
                  className={`relative group inline-flex items-center px-1 pt-1 text-sm transition-colors duration-200 ${isActive ? "text-indigo-600 font-bold" : "text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-center transition-transform duration-300 ease-out ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}></span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/creator"
              className="hidden lg:flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Creators
            </Link>
            <ThemeToggle />
            <div className="min-w-8">
              {isMounted && <UserButton afterSignOutUrl="/" />}
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
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
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
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
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 font-bold"
                    : "text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/creator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-indigo-600 dark:text-indigo-400 font-bold text-base"
            >
              Creators Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
