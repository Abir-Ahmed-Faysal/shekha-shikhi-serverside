import { Request, Response, NextFunction } from "express";
import Grades from "../models/gradeModels";

interface GradeParams {
  grade: string;
}

export interface GradePayload {
  grade: number;
  title: string;
  subjects: {
    subjectId: string;
    name: string;
  }[];
}

/* ============================================
   GET ALL GRADES
   ============================================ */
export const getAllGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grades = await Grades.find();

    if (grades.length === 0) {
      return res.status(404).json({
       
        success: false,
        message: "No grades found",
        data: null,
      });
    }

    return res.status(200).json({
      
      success: true,
      message: "Grades fetched successfully",
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};


/* ============================================
   GET GRADE BY VALUE
   ============================================ */
export const getGradeByValue = async (
  req: Request<GradeParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade } = req.params;

    const gradeData = await Grades.findOne({ grade });

    if (!gradeData) {
      return res.status(404).json({
        // ✅ Order: 1️⃣ success → 2️⃣ message → 3️⃣ data
        success: false,
        message: "No grade found with this value",
        data: null,
      });
    }

    return res.status(200).json({
      // ✅ same order
      success: true,
      message: "Grade fetched successfully",
      data: gradeData,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================
    POST NEW GRADE
   ============================================ */
export const postGrade = async (
  req: Request<{}, {}, { payload: GradePayload }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload } = req.body;

    if (
      !payload ||
      typeof payload.grade !== "number" ||
      typeof payload.title !== "string" ||
      !Array.isArray(payload.subjects)
    ) {
      return res.status(400).json({
        // ✅ Order: 1️⃣ success → 2️⃣ message → 3️⃣ data
        success: false,
        message:
          "Invalid payload: grade must be a number, title must be a string, and subjects must be an array.",
        data: null, // 🔧 added for consistency
      });
    }

    payload.title = payload.title.trim();

    const data = await Grades.create(payload);

    return res.status(201).json({
      // ✅ same order
      success: true,
      message: "Grade created successfully",
      data,
    });
  } catch (error) {
    next(error); // handled by global error middleware
  }
};
