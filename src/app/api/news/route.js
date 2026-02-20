export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Define query: Use category if present, otherwise default to "latest world news"
  // You can also map categories to more complex queries here if desired
  let query = "latest world news";

  if (category && category !== "undefined" && category !== "null") {
    query = category;

    // Optional: Enhance query for specific categories
    if (category.toLowerCase() === "business") query = "business OR stock market OR startups";
  }

  console.log(`API Route: Fetching news for query: ${query}`);

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`
  );

  const data = await res.json();
  console.log(`API Route: Received ${data.articles?.length || 0} articles`);

  return Response.json(data);
}

