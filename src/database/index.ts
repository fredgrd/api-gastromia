import mongoose from "mongoose";

export const connectDatabase = () => {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const uri = `mongodb+srv://${username}:${password}@cluster0.xq6fi.mongodb.net/?retryWrites=true&w=majority`;

  mongoose.connect(uri,{dbName: "miaDB"},  (error) => {
    if (error) {
      console.log(`MongoDB connection error: ${error}`);
    }

    console.log("Connected to MongoDB 🚀");
  });
};
