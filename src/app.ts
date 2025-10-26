import express, { Request, Response } from "express";
import todoRoutes from "./routes/todoRoutes";
import subjectModel from "./routes/subjectRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import chapterRoutes from "./routes/chapterRoutes";
import translation from "./routes/translation";
import cors from 'cors';
import { error } from "./middleware/errorHandler";
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", todoRoutes);
app.use("/api", gradeRoutes);
app.use("/api", chapterRoutes);
app.use('/api', translation)
app.use("/api", subjectModel);


app.get("/", (req: Request, res: Response) => {
  res.send("shekha-shikhi is running");
});


app.use(error)

export default app;
