export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = "latest world news";

  if (category && category !== "undefined" && category !== "null") {
    query = category;

    if (category.toLowerCase() === "business") query = "business OR stock market OR startups";
  }

  console.log(`API Route: Fetching news for query: ${query}`);

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`
  );

  const data = await res.json();

  // Deduplicate articles and add stable unique IDs to articles for routing
  if (data.articles) {
    const seenUrls = new Set();
    data.articles = data.articles
      .filter((article) => {
        if (!article.url || seenUrls.has(article.url)) return false;
        seenUrls.add(article.url);
        return true;
      })
      .map((article) => ({
        ...article,
        // Use a stable ID based on URL (base64 encoded to be URL safe-ish)
        id: Buffer.from(article.url).toString("base64").substring(0, 32)
      }));
  }

  console.log(`API Route: Received ${data.articles?.length || 0} articles`);

  return Response.json(data);
}

