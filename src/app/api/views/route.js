import connectDB from "@/lib/mongodb";
import BlogView from "@/models/BlogView";

export async function POST(req) {
    try {
        const { blogId } = await req.json();

        if (!blogId) {
            return new Response(JSON.stringify({ error: "blogId is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Extract IP address from headers
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ip = forwardedFor ? forwardedFor.split(",")[0] : (realIp || "127.0.0.1");

        await connectDB();

        // Check if the blogView document exists
        let viewDoc = await BlogView.findOne({ blogId });

        if (!viewDoc) {
            // Document doesn't exist, create it with 1 view and this IP
            viewDoc = await BlogView.create({
                blogId,
                views: 1,
                ips: [ip]
            });
        } else if (!(viewDoc.ips || []).includes(ip)) {
            // Document exists but IP is not in array, increment and add IP
            viewDoc = await BlogView.findOneAndUpdate(
                { blogId },
                {
                    $inc: { views: 1 },
                    $push: { ips: ip }
                },
                { new: true }
            );
        }
        // If it includes the IP, viewDoc remains the result from findOne

        return new Response(JSON.stringify({ views: viewDoc.views }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating views:", error);
        return new Response(JSON.stringify({ error: "Failed to update views", details: error.message, stack: error.stack }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("blogId");

        if (!blogId) {
            return new Response(JSON.stringify({ error: "blogId is required" }), { status: 400 });
        }

        await connectDB();
        const viewDoc = await BlogView.findOne({ blogId });

        return new Response(JSON.stringify({ views: viewDoc ? viewDoc.views : 0 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch views" }), { status: 500 });
    }
}
