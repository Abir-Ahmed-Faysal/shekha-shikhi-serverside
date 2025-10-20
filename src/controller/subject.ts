import { NextFunction, Request, Response } from "express";

interface iQuestionPayload {
  _id?: string;
  type: "mcq" | "short" | "long";
  question: string;
  options?: string[];
  correct?: string | number | string[];
  answer?: string;
  tags?: string[];
  meta?: { difficulty?: string; marks?: number };
}

interface iChaptersPayload {
  _id?: string;
  title: string;
  description?: string;
  questions: iQuestionPayload[];
}

interface ISubjectPayload {
  name: string;
  grade: number;
  chapters: iChaptersPayload[];
}

// ============================
//  Controller: Create Subject
// ============================


export const subjectCreate = async (
  req: Request<{}, {}, ISubjectPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

   
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Payload must exist",
        data: null,
      });
    }
    if (
      typeof payload.name !== "string" ||
      typeof payload.grade !== "number" ||
      !Array.isArray(payload.chapters)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payload: 'name' must be string, 'grade' must be number, and 'chapters' must be an array.",
        data: null,
      });
    }
    
    if (payload.chapters.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Chapters array cannot be empty.",
        data: null,
      });
    }

    // 🧩 4. Validate each chapter
    for (const chapter of payload.chapters) {
      if (typeof chapter.title !== "string") {
        return res.status(400).json({
          success: false,
          message: "Each chapter must have a valid 'title' (string).",
          data: null,
        });
      }

      if (!Array.isArray(chapter.questions)) {
        return res.status(400).json({
          success: false,
          message: "Each chapter must include a 'questions' array.",
          data: null,
        });
      }

      // 🧩 5. Validate each question
      for (const question of chapter.questions) {
        if (typeof question.type !== "string" || typeof question.question !== "string") {
          return res.status(400).json({
            success: false,
            message:
              "Each question must include a valid 'type' and 'question' field.",
            data: null,
          });
        }
      }
    }

    // ✅ 6. Now you can safely create subject in DB
    // const data = await Subject.create(payload);
    // return res.status(201).json({
    //   success: true,
    //   message: "Subject created successfully",
    //   data,
    // });

 


  } catch (error) {
    next(error);
  }
};
