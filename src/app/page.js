import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  const dummyBlogs = [
    { category: "Business", title: "The Future of AI in Enterprise", desc: "How artificial intelligence is reshaping the corporate world..." },
    { category: "Technology", title: "Quantum Computing: A New Era", desc: "Exploring the possibilities of quantum mechanics in computing..." },
    { category: "Sports", title: "The Evolution of Athlete Training", desc: "Data analytics is changing how athletes prepare for big games..." },
    { category: "Entertainment", title: "Streaming Wars: What's Next?", desc: "The changing landscape of digital media consumption..." },
    { category: "Health", title: "Mental Health in the Digital Age", desc: "Strategies for maintaining well-being in a connected world..." },
    { category: "Science", title: "Mars Colonization: Dream or Reality?", desc: "The latest updates on humanity's quest to reach the red planet..." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Simple Logo Icon */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blogify<span className="text-indigo-600">.AI</span></h1>
        </div>

        <div className="flex gap-4">
          <Link href="/sign-in">
            <button className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
              Login
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-5 py-2.5 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-gray-50 to-white opacity-60"></div>

        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
            🚀 The Future of Content Consumption
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Read Smarter, Not Harder with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Summaries</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get concise, intelligent summaries of the latest articles in Business, Tech, Health, and more. Save time and stay informed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <button className="px-8 py-4 rounded-full bg-indigo-600 text-white text-lg font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1">
                Start Reading for Free
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="px-8 py-4 rounded-full bg-white text-gray-700 border border-gray-200 text-lg font-semibold hover:bg-gray-50 transition-all">
                Explore Categories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Locked Blog Feed Section */}
      <section className="py-20 px-6 md:px-16 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
            <p className="text-gray-500">Curated content from top creators.</p>
          </div>

          <div className="relative">
            {/* Overlay Gradient for "Locked" effect */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-white/60 to-white flex flex-col items-center justify-center pt-32 backdrop-blur-[2px]">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border border-gray-100 max-w-md mx-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Unlock Unlimited Access</h3>
                <p className="text-gray-500 mb-6">Join thousands of readers and get AI-powered summaries for every article.</p>
                <Link href="/sign-up">
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    Unlock More Blogs
                  </button>
                </Link>
                <p className="mt-4 text-sm text-gray-400">Already a member? <Link href="/sign-in" className="text-indigo-600 hover:underline">Log in</Link></p>
              </div>
            </div>

            {/* Dummy Grid (Blurred/Behind) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50 pointer-events-none select-none filter blur-sm">
              {dummyBlogs.map((blog, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{blog.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{blog.title}</h3>
                    <p className="text-gray-500 mb-4 flex-1">{blog.desc}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>5 min read</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} Blogify.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
