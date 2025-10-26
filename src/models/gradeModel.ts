import { Schema, model, Document, Types } from "mongoose";

interface IGradeSubject {
  subjectId: Types.ObjectId;
  name: string;
}

export interface IGrade extends Document {
  grade: number;
  title: string;
  subjects: IGradeSubject[];
}

const gradeSubjectSchema = new Schema<IGradeSubject>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const gradeSchema = new Schema<IGrade>(
  {
    grade: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true, unique: true },
    subjects: { type: [gradeSubjectSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IGrade>("Grade", gradeSchema);
