import { Schema, model, Types, Document } from "mongoose";


export interface ISubject {
  subjectId: Types.ObjectId; // reference to Subject collection
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


const gradeSchema = new Schema<IGrade>(
  {
    grade: {
      type: Number,
      required: [true, "Grade দরকার"],
      min: [1, "Grade কমপক্ষে 1 হতে হবে"],
    },
    title: {
      type: String,
      required: [true, "Title দরকার"],
      trim: true,
    },
    subjects: {
      type: [subjectSchema],
      validate: {
        validator: (v: ISubject[]) => Array.isArray(v) && v.length > 0,
        message: "অন্তত একটি subject থাকতে হবে",
      },
    },
  },
  { timestamps: true }
);

/**
 * Model Export
 * - Singular name: 'Grade' (MongoDB auto-makes collection `grades`)
 */
const Grades = model<IGrade>("Grades", gradeSchema);

export default Grades;
