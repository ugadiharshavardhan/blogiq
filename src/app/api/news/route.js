import { fetchNews } from "@/lib/fetchNews";

export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const articles = await fetchNews(category);

  return Response.json({
    status: "ok",
    totalResults: articles.length,
    articles
  });
}
