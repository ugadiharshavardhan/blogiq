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
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-indigo-600">
          BriefIQ
        </h1>

        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/home/${item}`}
              className={`capitalize font-medium transition ${
                pathname === `/home/${item}`
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
