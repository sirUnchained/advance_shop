import mongoose from "mongoose";
import redis from "./redis";
import app from "./app";
import configs from "./configENV";

async function run() {
  try {
    await mongoose.connect(configs.mongoURI);
    console.log(`mongo connected on ${mongoose.connection.host}`);
    app.listen(configs.port, () => {
      console.log(`app listen on port ${configs.port}`);
    });
  } catch (error) {
    await mongoose.disconnect();
    redis.disconnect();
    console.log(error);
    process.exit(1);
  }
}

run();
