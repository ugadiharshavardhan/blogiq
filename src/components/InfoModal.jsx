"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, ShieldCheck, LifeBuoy, Mail, Lock, FileText } from "lucide-react";

export default function InfoModal({ isOpen, onClose, type }) {
    const content = {
        goal: {
            title: "Our Goal",
            icon: <Target className="w-8 h-8 text-indigo-500" />,
            description: "At BlogIQ, our mission is to democratize high-quality information. We believe that knowledge should be accessible, clear, and free from the clutter of modern marketing. We combine human editorial passion with intuitive technology to create a space where curiosity thrives and deep understanding is the standard.",
            highlights: [
                "Democratizing quality insights",
                "Clutter-free reading experience",
                "Human-centric editorial standards"
            ]
        },
        guidelines: {
            title: "Community Guidelines",
            icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
            description: "We are a community built on respect and intellectual integrity. To maintain the quality of BlogIQ, we ask all members and creators to follow these core principles:",
            highlights: [
                "Prioritize accuracy and well-researched facts",
                "Communicate with clarity and professional respect",
                "Avoid sensationalism and divisive rhetoric"
            ]
        },
        support: {
            title: "Support Center",
            icon: <LifeBuoy className="w-8 h-8 text-blue-500" />,
            description: "Your experience is our priority. Whether you're having trouble navigating the platform or need help with your creator tools, our support team is here to assist you every step of the way.",
            highlights: [
                "24/7 technical troubleshooting",
                "Creator onboarding assistance",
                "Detailed platform documentation"
            ]
        },
        contact: {
            title: "Get in Touch",
            icon: <Mail className="w-8 h-8 text-purple-500" />,
            description: "Have a question, feedback, or a partnership idea? We'd love to hear from you. Connecting with our community helps us evolve and serve you better.",
            highlights: [
                "General Inquiries: hello@blogiq.com",
                "Creator Partnerships: creators@blogiq.com",
                "Follow us on Twitter: @BlogIQ"
            ]
        },
        privacy: {
            title: "Privacy Policy",
            icon: <Lock className="w-8 h-8 text-slate-500" />,
            description: "We take your privacy seriously. This policy outlines how we handle your data, ensuring your information is secure and your reading experience remains private and uncompromised.",
            highlights: [
                "Transparent data collection practices",
                "No third-party data selling",
                "Industry-standard security measures"
            ]
        },
        terms: {
            title: "Terms of Service",
            icon: <FileText className="w-8 h-8 text-amber-500" />,
            description: "By using BlogIQ, you agree to our terms of service which are designed to keep our platform safe, fair, and focused on delivering high-quality content to our users.",
            highlights: [
                "Clear user rights and responsibilities",
                "Intellectual property protections",
                "Community-first moderation policies"
            ]
        }
    };

    const activeContent = content[type?.toLowerCase()] || content.goal;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-8 md:p-12 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="mb-8">
                                <div className="mb-6 w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                    {activeContent.icon}
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                                    {activeContent.title}
                                </h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    {activeContent.description}
                                </p>

                                <div className="space-y-4">
                                    {activeContent.highlights.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all active:scale-95 shadow-xl"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
