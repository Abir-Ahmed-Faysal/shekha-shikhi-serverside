import { Schema, model, Document, Types } from "mongoose";
import { IQuestion, questionSchema } from "./questionModel";

export interface IChapter extends Document {
  title: string;
  description?: string;
  grade: Types.ObjectId;
  subject: Types.ObjectId;
  questions: IQuestion[];
}

const chapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    grade: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

// একই subject-এ একই নামের chapter যেন না হয়
chapterSchema.index({ title: 1, subject: 1 }, { unique: true });

export default model<IChapter>("Chapter", chapterSchema);
