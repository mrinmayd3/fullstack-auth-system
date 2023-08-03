import mongoose from "mongoose";

export async function DBconnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection ERROR, make sure DB is connected", err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
