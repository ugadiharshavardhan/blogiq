
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {children}
                    </div>
                    <div className="hidden lg:block lg:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}
