import { Schema, model, Types, Document } from "mongoose";

export interface ISubject {
  subjectId: Types.ObjectId; 
  name: string;
}

export interface IGrade extends Document {
  grade: number;
  title: string;
  subjects: ISubject[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subject Subschema
 * - Embedded for quick access
 * - Reference to Subject collection (for populate)
 */
const subjectSchema = new Schema<ISubject>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject", // allows populate()
      required: [true, "Subject ObjectId দরকার"],
    },
    name: {
      type: String,
      required: [true, "Subject name দরকার"],
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Grade Schema
 * - Represents a class (e.g., Class 1, 2, 3...)
 * - Contains a list of subjects by reference
 */
const gradeSchema = new Schema<IGrade>(
  {
    grade: {
      type: Number,
      required: [true, "Grade দরকার"],
      min: [1, "Grade কমপক্ষে 1 হতে হবে"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Title দরকার"],
      trim: true,
    },
    subjects: {
      type: [subjectSchema],
      required: false,
      default: [],
      
    },
  },
  { timestamps: true }
);

const Grade = model<IGrade>("Grade", gradeSchema);

export default Grade;
