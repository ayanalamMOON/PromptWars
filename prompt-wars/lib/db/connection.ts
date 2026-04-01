import mongoose from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

const cached = global._mongoClientCache || { conn: null, promise: null };
global._mongoClientCache = cached;

export async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
