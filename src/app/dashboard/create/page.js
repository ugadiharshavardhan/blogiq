import Link from "next/link";
import CreateBlogForm from "@/components/CreateBlogForm";

export default function CreateBlogPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Write New Story</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Publish your ideas to the world.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ← Back to Home
                        </Link>
                        <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Cancel
                        </Link>
                    </div>
                </header>

                <CreateBlogForm />
            </div>
        </div>
    );
}
