import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogDetailsInteractive from "@/components/BlogDetailsInteractive";

export async function generateMetadata({ params }) {
    const { id } = await params;

    
    if (id.length === 24) {
        try {
            await connectDB();
            const doc = await Blog.findById(id).lean();
            if (doc) {
                return {
                    title: `${doc.title} | BlogIQ`,
                    description: doc.excerpt || doc.content.substring(0, 160).replace(/<[^>]+>/g, ''),
                    openGraph: {
                        images: doc.coverImage ? [doc.coverImage] : [],
                    }
                };
            }
        } catch (error) {
            console.error(error);
        }
    }
    return { title: "Read Story | BlogIQ" };
}

export default async function BlogDetailsPage({ params }) {
    const { id } = await params;
    let serverBlog = null;

    if (id && id.length === 24) {
        try {
            await connectDB();
            const doc = await Blog.findById(id).lean();

            if (doc) {
                serverBlog = {
                    ...doc,
                    _id: doc._id.toString(),
                    id: doc._id.toString(),
                    publishedAt: doc.createdAt?.toISOString(),
                    isInternal: true,
                    url: `/blog/${doc.slug || 'local'}/details/${doc._id}`
                };

                serverBlog.description = serverBlog.excerpt || (serverBlog.content ? serverBlog.content.replace(/<[^>]+>/g, '').substring(0, 150) + "..." : "No description available.");
                serverBlog.urlToImage = serverBlog.coverImage || null;
                serverBlog.author = serverBlog.authorName || "Editorial Staff";
                serverBlog.source = { name: "BlogIQ Editorial" };
            }
        } catch (error) {
            console.error("Failed to fetch blog server-side:", error);
        }
    }

    return <BlogDetailsInteractive serverBlog={serverBlog} paramId={id} />;
}
