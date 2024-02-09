import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
};

let cached = global.mongoose;

if (!cached)
  cached = global.mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn)
    return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .set({ debug: true, strictQuery: false })
      .connect(`${MONGODB_URI}`)
      .then(mongoose => mongoose);
  };

  cached.conn = await cached.promise;

  return cached.conn;
};