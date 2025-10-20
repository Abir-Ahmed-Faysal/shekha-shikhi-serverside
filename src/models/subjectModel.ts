import { Schema, model, Document } from "mongoose";

export interface IQuestion {
  _id?: string;
  type: "mcq" | "short" | "long";
  question: string;
  options?: string[];
  correct?: string | number | string[];
  answer?: string;
  tags?: string[];
  meta?: { difficulty?: string; marks?: number };
}

export interface IChapter {
  _id?: string;
  title: string;
  description?: string;
  questions: IQuestion[];
}

export interface ISubject extends Document {
  name: string;
  grade: number;
  chapters: IChapter[];
}

const questionSchema = new Schema<IQuestion>(
  {
    type: { type: String, enum: ["mcq", "short", "long"], required: true },
    question: { type: String, required: true },
    options: [String],
    correct: Schema.Types.Mixed,
    answer: String,
    tags: [String],
    meta: {
      difficulty: String,
      marks: Number,
    },
  },
  { _id: true }
);



const chapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true },
    description: String,
    questions: [questionSchema],
  },
  { _id: true }
);



const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: Number, required: true },
    chapters: [chapterSchema],
  },
  { timestamps: true }
);



export default model<ISubject>("Subject", subjectSchema);
