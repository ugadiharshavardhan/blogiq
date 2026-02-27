import crypto from 'crypto';
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function fetchNews(category = null) {
    let query = "latest world news";

    if (category && category !== "undefined" && category !== "null") {
        query = category;
        if (category.toLowerCase() === "business") {
            query = "business OR stock market OR startups";
        }
    }

    let externalArticles = [];
    try {
        // Use top-headlines for immediate breaking news, and forcefully disable all Next.js fetch caching
        const endpoint = query === "latest world news"
            ? `https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`
            : `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`;

        const res = await fetch(endpoint, { cache: 'no-store' });
        const apiData = await res.json();
        if (apiData.articles) {
            const seenUrls = new Set();
            externalArticles = apiData.articles
                .filter((article) => {
                    if (!article.url || seenUrls.has(article.url)) return false;
                    seenUrls.add(article.url);
                    return true;
                })
                .map((article) => ({
                    ...article,
                    id: crypto.createHash('md5').update(article.url).digest('hex')
                }));
        }
    } catch (err) {
        console.error("NewsAPI fetch error:", err);
    }

    let internalArticles = [];
    try {
        await connectDB();
        const internalQuery = { status: "approved" };
        if (category && category !== "undefined" && category !== "null") {
            internalQuery.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        const approvedBlogs = await Blog.find(internalQuery).sort({ createdAt: -1 }).lean();

        internalArticles = approvedBlogs.map(blog => ({
            id: blog._id.toString(),
            title: blog.title,
            description: blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 150) + "..." : "No description available."),
            urlToImage: blog.coverImage || null,
            publishedAt: blog.createdAt,
            author: blog.authorName || "Editorial Staff",
            source: { name: "BlogIQ Editorial" },
            url: `/blog/${blog.slug || 'local'}/details/${blog._id}`,
            content: blog.content,
            category: blog.category || "Editorial",
            isInternal: true,
            blogId: blog._id.toString()
        }));
    } catch (err) {
        console.error("Internal DB fetch error:", err);
    }

    const combinedArticles = [...internalArticles, ...externalArticles];

    // Sort all articles globally by most recent first
    combinedArticles.sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
    });

    return combinedArticles;
}
