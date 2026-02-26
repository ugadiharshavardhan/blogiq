import { auth, clerkClient } from "@clerk/nextjs/server";
import HomeInteractiveArea from "@/components/HomeInteractiveArea";
import { fetchNews } from "@/lib/fetchNews";

export default async function HomePage() {
    
    const { userId } = await auth();
    let userFirstName = "Guest";

    if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        userFirstName = user.firstName || "Guest";
    }

    
    const articles = await fetchNews();

    return (
        <HomeInteractiveArea
            initialArticles={articles}
            userFirstName={userFirstName}
        />
    );
}
