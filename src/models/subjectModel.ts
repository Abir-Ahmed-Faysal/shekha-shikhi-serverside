import { Schema, model, Document, Types } from "mongoose";

interface ISubjectChapter {
  chapterId: Types.ObjectId; 
  title: string;
}

export interface ISubject extends Document {
  name: string;
  grade: Types.ObjectId;
  chapters: ISubjectChapter[];
}

const subjectChapterSchema = new Schema<ISubjectChapter>(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "chapterId অবশ্যই দিতে হবে"],
    },
    title: { type: String, required: [true, "chapter title দিতে হবে"] },
  },
  { _id: false }
);

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
    chapters: { type: [subjectChapterSchema], default: [] },
  },
  { timestamps: true }
);

// প্রতিটি গ্রেডে একই নামের subject যেন না হয়
subjectSchema.index({ name: 1, grade: 1 }, { unique: true });

export default model<ISubject>("Subject", subjectSchema);
