import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const revalidate = 3600;

export async function GET() {
    const categories = [
        { name: "Business", query: "business OR stock market OR startups" },
        { name: "Technology", query: "technology OR gadgets OR software" },
        { name: "Sports", query: "sports OR football OR basketball" },
        { name: "Entertainment", query: "entertainment OR movies OR music" },
        { name: "Health", query: "health OR medicine OR wellness" },
        { name: "Science", query: "science OR space OR research" }
    ];

    try {
        await connectDB();
        const results = await Promise.all(
            categories.map(async (cat) => {
                try {
                    // Fetch external news count
                    const res = await fetch(
                        `https://newsapi.org/v2/everything?q=${encodeURIComponent(cat.query)}&pageSize=1&apiKey=${process.env.NEWS_API_KEY}`,
                        { cache: 'no-store' }
                    );
                    const data = await res.json();
                    const externalCount = data.totalResults || 0;

                    // Fetch internal blog count
                    const internalCount = await Blog.countDocuments({
                        status: "approved",
                        category: { $regex: new RegExp(`^${cat.name}$`, 'i') }
                    });

                    return {
                        slug: cat.name.toLowerCase(),
                        total: externalCount + internalCount
                    };
                } catch (err) {
                    console.error(`Error fetching count for ${cat.name}:`, err);
                    return {
                        slug: cat.name.toLowerCase(),
                        total: 0
                    };
                }
            })
        );

        const countsMap = results.reduce((acc, curr) => {
            acc[curr.slug] = { total: curr.total };
            return acc;
        }, {});

        return Response.json({
            success: true,
            counts: countsMap,
            timestamp: new Date().getTime()
        });
    } catch (error) {
        console.error("Counts API error:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
