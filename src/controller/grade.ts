import { Request, Response, NextFunction } from "express";
import Grade from "../models/gradeModel";

interface GradeParams {
  grade: string;
}

export interface GradePayload {
  grade: number;
  title: string;
}


/* =========================
   GET ALL GRADES
   ========================= */
export const getAllGrades = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const grades = await Grade.find();
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: "কোনো Grade পাওয়া যায়নি।",
        data:null
      });
    }

    res.status(200).json({
      success: true,
      message: "সব Grade সফলভাবে পাওয়া গেছে।",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};


/* =========================
   GET GRADE BY VALUE
   ========================= */
export const getGradeByValue = async (
  req: Request<GradeParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade } = req.params;
    const gradeDoc = await Grade.findOne({ grade: Number(grade) });


    if (!gradeDoc) {
      return res.status(404).json({
        success: false,
        message: `Grade ${grade} পাওয়া যায়নি।`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade সফলভাবে পাওয়া গেছে।",
      data: gradeDoc,
    });
  } catch (error) {
    next(error);
  }
};


/* =========================
   CREATE GRADE
   ========================= */
export const postGrade = async (
  req: Request<{}, {}, GradePayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade, title } = req.body;

    if (typeof grade !== "number" || !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload. grade অবশ্যই সংখ্যা, title অবশ্যই স্ট্রিং হতে হবে।",
      });
    }

    const exists = await Grade.findOne({ grade });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: `Grade ${grade} আগেই আছে।`,
      });
    }

    const newGrade = await Grade.create({
      grade,
      title: title.trim(),
      subjects: [],
    });

    res.status(201).json({
      success: true,
      message: "Grade সফলভাবে তৈরি হয়েছে।",
      data: newGrade,
    });
  } catch (error) {
    next(error);
  }
};
