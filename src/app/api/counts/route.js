export const revalidate = 3600; // Cache for 1 hour at the edge

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
        const results = await Promise.all(
            categories.map(async (cat) => {
                const res = await fetch(
                    `https://newsapi.org/v2/everything?q=${encodeURIComponent(cat.query)}&pageSize=1&apiKey=${process.env.NEWS_API_KEY}`
                );
                const data = await res.json();
                return {
                    slug: cat.name.toLowerCase(),
                    count: data.totalResults || 0
                };
            })
        );

        const countsMap = results.reduce((acc, curr) => {
            acc[curr.slug] = curr.count;
            return acc;
        }, {});

        return Response.json({
            success: true,
            counts: countsMap,
            timestamp: new Date().getTime()
        });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
