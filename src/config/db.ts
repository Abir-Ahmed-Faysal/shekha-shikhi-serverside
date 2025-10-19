const mongoose = require("mongoose");

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("connection to db successful    ");
  } catch (error) {
    console.log("fail to connect to db", error);
    process.exit(1);
  }
};

export default connectDB;




