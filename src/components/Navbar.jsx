"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="BlogIQ Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            BlogIQ
          </h1>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/home/${item}`}
              className={`capitalize font-medium transition ${pathname === `/home/${item}`
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
            >
              {item}
            </Link>
          ))}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-2 hidden lg:block"></div>
          <Link
            href="/creator"
            className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Creators
          </Link>
        </div>



        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
