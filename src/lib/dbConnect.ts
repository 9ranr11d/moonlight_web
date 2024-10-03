import mongoose, { Mongoose } from "mongoose";

/** MongoDB URI */
const MONGODB_URI: string = process.env.MONGODB_URI!;

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

/** MongoDB 연결 */
export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .set({ debug: true, strictQuery: false })
      .connect(`${MONGODB_URI}`)
      .then(mongoose => {
        console.log("Successfully connected to MongoDB");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
