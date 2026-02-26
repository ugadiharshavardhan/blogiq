import { auth, clerkClient } from "@clerk/nextjs/server";
import CategoryInteractiveArea from "@/components/CategoryInteractiveArea";
import { fetchNews } from "@/lib/fetchNews";

export default async function CategoryPage({ params }) {
  // Determine category and user on the server
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const { userId } = await auth();
  let userFirstName = "Guest";

  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    userFirstName = user.firstName || "Guest";
  }

  // Fetch articles on the server
  const articles = await fetchNews(category);

  return (
    <CategoryInteractiveArea
      category={category}
      initialArticles={articles}
      userFirstName={userFirstName}
    />
  );
}
