import crypto from 'crypto';
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = "latest world news";

  if (category && category !== "undefined" && category !== "null") {
    query = category;
    if (category.toLowerCase() === "business") {
      query = "business OR stock market OR startups";
    }
  }
  let externalArticles = [];
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`
    );
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
  }
  let internalArticles = [];
  try {
    await connectDB();
    const internalQuery = { status: "approved" };
    if (category && category !== "undefined" && category !== "null") {
      internalQuery.category = category.toLowerCase();
    }

    const approvedBlogs = await Blog.find(internalQuery).sort({ createdAt: -1 }).lean();

    internalArticles = approvedBlogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      description: blog.excerpt || blog.content.replace(/<[^>]+>/g, '').substring(0, 150) + "...",
      urlToImage: blog.coverImage || null,
      publishedAt: blog.createdAt,
      author: blog.authorName,
      source: { name: "Antigravity Editorial" },
      url: `/blog/${blog.slug}/details/${blog._id}`,
      content: blog.content,
      category: blog.category || "Editorial",
      isInternal: true
    }));
  } catch (err) {
  }
  const data = {
    status: "ok",
    totalResults: internalArticles.length + externalArticles.length,
    articles: [...internalArticles, ...externalArticles]
  };

  return Response.json(data);
}
