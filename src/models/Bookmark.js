import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    blogId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    url: {
        type: String,
        required: true,
    },
    urlToImage: String,
    category: String,
    publishedAt: String,
    author: String,
    source: {
        name: String,
        id: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
