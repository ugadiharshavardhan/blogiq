"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import {
    Zap,
    Search,
    ArrowRight,
    Sparkles,
    Twitter,
    Github,
    Linkedin,
    Mail,
    BookOpen,
    Users,
    Rss,
    PenTool
} from "lucide-react";

export default function LandingClient() {
    const values = [
        {
            title: "Written by People",
            description: "A community for real stories, research, and insights. No bots, just pure human intelligence.",
            icon: <Users className="w-8 h-8 text-indigo-500" />
        },
        {
            title: "Open News",
            description: "Real-time updates from trusted sources globally. Stay informed without the paywalls.",
            icon: <Rss className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Clearer Insights",
            description: "Get the main points quickly with smart summaries. Designed to save you time.",
            icon: <Zap className="w-8 h-8 text-indigo-500" />
        },
        {
            title: "Built for Curiosity",
            description: "Explore tech, science, and business through a simple, focused interface.",
            icon: <Search className="w-8 h-8 text-purple-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-indigo-100 overflow-x-hidden transition-colors duration-300">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-[100] glass-effect h-20 border-b border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">
                            Blog<span className="text-indigo-600">IQ</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <nav className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            <a href="#about" className="hover:text-indigo-600 transition-colors">Goal</a>
                            <a href="#explore" className="hover:text-indigo-600 transition-colors">Stories</a>
                        </nav>
                        <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 hidden lg:block"></div>
                        <ThemeToggle />
                        <div className="flex items-center gap-4">
                            <Link href="/sign-in">
                                <button className="text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer">
                                    Log In
                                </button>
                            </Link>
                            <Link href="/sign-up">
                                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                    Join Free
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-52 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 dot-pattern opacity-5 dark:opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                            <BookOpen className="w-3 h-3" />
                            Community Knowledge Hub
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10">
                            Read and <br />
                            <span className="text-indigo-600">Grow.</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-14 max-w-lg leading-relaxed font-semibold">
                            The simplest way to read global news and community blogs. No paywalls, no complexity. Just high-quality information, for free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/sign-up">
                                <button className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4 group cursor-pointer">
                                    Start Reading Free
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                        <div className="relative rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] bg-white dark:bg-gray-950 group">
                            <img
                                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200"
                                alt="Reading Focus"
                                className="w-full aspect-video object-cover block grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-black/30 via-transparent to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section id="about" className="py-32 bg-gray-50/50 dark:bg-gray-950/20 border-y border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {values.map((v, i) => (
                            <div key={i} className="group">
                                <div className="mb-8 w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{v.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-none">
                        Built for <br />
                        <span className="text-indigo-600 italic">Curiosity.</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-20">
                        Whether you're here to stay updated on tech or share your own observations, BlogIQ is your simple home for knowledge.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                        <div className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-black mb-4 tracking-tight">Read</div>
                            <p className="text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">Daily news and community stories at your fingertips.</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl scale-105">
                            <div className="text-4xl font-black mb-4 tracking-tight">Write</div>
                            <p className="opacity-90 font-semibold text-white/90 leading-relaxed">Share your own IQ. Post blogs and reach a global audience.</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-black mb-4 tracking-tight">Grow</div>
                            <p className="text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">Join a network that values clarity over marketing noise.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-32 relative">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-gray-900 dark:bg-indigo-600 rounded-[3.5rem] p-20 text-center text-white shadow-2xl">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
                            The platform <br /> is yours.
                        </h2>
                        <p className="text-xl opacity-70 mb-12 max-w-lg mx-auto font-medium">
                            Join thousands of readers and creators. Always free, forever community-driven.
                        </p>
                        <Link href="/sign-up">
                            <button className="px-12 py-5 bg-white text-black dark:text-gray-900 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl cursor-pointer">
                                Create Free Account
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-20 pb-10 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-20">
                        <div className="max-w-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="text-white w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tighter italic">Blog<span className="text-indigo-600">IQ</span></h2>
                            </div>
                            <p className="text-sm text-gray-400 font-medium leading-loose mb-10">
                                A community-driven platform for global insights and news. Knowledge for everyone, forever free.
                            </p>
                            <div className="flex gap-6">
                                {[
                                    { Icon: Twitter, href: "https://twitter.com/blogiq" },
                                    { Icon: Github, href: "https://github.com/blogiq" },
                                    { Icon: Linkedin, href: "https://linkedin.com/company/blogiq" },
                                    { Icon: Mail, href: "mailto:hello@blogiq.com" }
                                ].map(({ Icon, href }, i) => (
                                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer">
                                        <Icon className="w-5 h-5" strokeWidth={2} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
                            {[
                                {
                                    title: "Read",
                                    links: ["Trending", "Tech News", "Science", "Business"]
                                },
                                {
                                    title: "Community",
                                    links: ["Our Goal", "Guidelines", "Support", "Contact"]
                                },
                                {
                                    title: "Legal",
                                    links: ["Privacy", "Terms"]
                                }
                            ].map((section, i) => (
                                <div key={i}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white mb-8 opacity-40">{section.title}</h4>
                                    <ul className="space-y-4">
                                        {section.links.map(link => (
                                            <li key={link}>
                                                <a href="#" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-800">
                        <span>&copy; {new Date().getFullYear()} BLOGIQ COMMUNITY</span>
                        <div className="flex gap-8">
                            <span>Human Knowledge</span>
                            <span>Open & Free</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
