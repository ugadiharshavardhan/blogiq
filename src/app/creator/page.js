import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Zap, Target, Globe, BarChart, PenTool } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export const metadata = {
    title: "BlogIQ Creators | Publish Global Insights",
    description: "Join the BlogIQ Creator program and share your knowledge with the world.",
};

export default function CreatorLandingPage() {
    const perks = [
        {
            title: "Global Distribution",
            description: "Your stories are injected directly into the main news feeds alongside top international publishers.",
            icon: <Globe className="w-8 h-8 text-indigo-500" />
        },
        {
            title: "AI Summarization Priority",
            description: "Your readers enjoy instant, intelligent summaries of your content powered by our Llama-3 NLP endpoints.",
            icon: <Zap className="w-8 h-8 text-purple-500" />
        },
        {
            title: "Advanced Analytics",
            description: "Monitor readership, engagement rates, and detailed metrics directly from your Creator Dashboard.",
            icon: <BarChart className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Premium Formatting",
            description: "Compose articles using our professional TipTap Rich Text Editor, ensuring a sleek presentation on any device.",
            icon: <PenTool className="w-8 h-8 text-pink-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-indigo-100 overflow-x-hidden transition-colors duration-300">
            <nav className="fixed top-0 w-full z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                            <img src="/icon.png" alt="BlogIQ Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">
                            Blog<span className="text-indigo-600">IQ</span>
                        </h1>
                        <span className="px-2 py-0.5 ml-2 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-900 text-gray-500 rounded-lg">
                            Creators
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
                            Back to App
                        </Link>
                    </div>
                </div>
            </nav>
            <section className="relative pt-48 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white dark:from-indigo-900/20 dark:via-black dark:to-black"></div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 outline outline-1 outline-indigo-100 dark:bg-indigo-900/30 dark:outline-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
                        <Target className="w-4 h-4 mb-0.5" />
                        Creator Partner Program
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                        Your Voice. <br />
                        <span className="text-indigo-600 italic">Amplified.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join the fastest-growing platform for modern thinkers. Publish directly to a global audience with premium tooling and permanent content ownership.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <SignedIn>
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <button className="w-full px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group">
                                    Go to Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                                <button className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
                                    Creator Login
                                </button>
                            </SignInButton>

                            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                                <button className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group">
                                    Register as Creator
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </SignUpButton>
                        </SignedOut>
                    </div>
                    <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Standard accounts can apply for Creator Status via Admins upon registration.
                    </p>
                </div>
            </section>
            <section className="py-24 bg-gray-50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Creator Credits & Benefits</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                            We equip you with the best tools to ensure your writing reaches its maximum potential without the technical overhead.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {perks.map((perk, i) => (
                            <div key={i} className="bg-white dark:bg-gray-950 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6">
                                    {perk.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                                    {perk.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <footer className="py-12 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black text-center">
                <div className="flex items-center justify-center gap-3 mb-6 opacity-30 grayscale saturate-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src="/icon.png" alt="BlogIQ Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-xl italic tracking-tighter text-gray-900 dark:text-white">BlogIQ</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    &copy; {new Date().getFullYear()} BlogIQ Creator Network
                </p>
            </footer>
        </div>
    );
}
