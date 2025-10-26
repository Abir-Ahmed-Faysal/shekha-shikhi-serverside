import config from "./config";
import app from "./app";
import connectDB from "./config/db";
connectDB();


app.listen(config.PORT, () => {
  
  console.log(`shekha-shikhi is running on port ${config.PORT}`);
});
