import express, { Request, Response } from "express";
import todoRoutes from "./routes/todoRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import cors from 'cors';
import { error } from "./middleware/errorHandler";
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", todoRoutes);
app.use("/api", gradeRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("Mini Todo is running");
});


app.use(error)

export default app;
