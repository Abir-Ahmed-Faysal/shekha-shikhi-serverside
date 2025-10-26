import { Schema } from "mongoose";

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

export const questionSchema = new Schema<IQuestion>(
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
