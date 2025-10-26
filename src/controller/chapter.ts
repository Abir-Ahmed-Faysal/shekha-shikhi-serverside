import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Chapter from "../models/chapterModel";
import Subject from "../models/subjectModel";
import Grade from "../models/gradeModel";

interface IPostChapterPayload {
  subjectId?: string;     
  subjectName?: string;   
  grade?: number;         
  title: string;         
  question: any;         
}

export const postChapter = async (
  req: Request<{}, {}, IPostChapterPayload>,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { subjectId, subjectName, grade, title, question } = req.body;

    //  ইনপুট যাচাই
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "title অবশ্যই প্রয়োজন এবং এটি একটি স্ট্রিং হতে হবে।",
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question ফিল্ডটি অবশ্যই দিতে হবে।",
      });
    }

    if (!subjectId && !subjectName) {
      return res.status(400).json({
        success: false,
        message: "subjectId অথবা subjectName দিতে হবে।",
      });
    }

    const questionsToAdd = Array.isArray(question) ? question : [question];

    //  Subject খুঁজে বের করা
    let subjectDoc = null;

    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({
          success: false,
          message: "subjectId সঠিক নয়।",
        });
      }
      subjectDoc = await Subject.findById(subjectId);
      if (!subjectDoc) {
        return res.status(404).json({
          success: false,
          message: `subject পাওয়া যায়নি (id: ${subjectId})।`,
        });
      }
    } else {
      if (typeof grade !== "number") {
        return res.status(400).json({
          success: false,
          message: "subjectName দিলে grade (number) দিতে হবে।",
        });
      }

      const gradeDoc = await Grade.findOne({ grade });
      if (!gradeDoc) {
        return res.status(404).json({
          success: false,
          message: `Grade ${grade} পাওয়া যায়নি।`,
        });
      }

      subjectDoc = await Subject.findOne({
        name: subjectName!.trim(),
        grade: gradeDoc._id,
      });

      if (!subjectDoc) {
        return res.status(404).json({
          success: false,
          message: `Subject "${subjectName}" Grade ${grade}-এ পাওয়া যায়নি।`,
        });
      }
    }

    //  ট্রানজ্যাকশন শুরু
    session.startTransaction();

    const trimmedTitle = title.trim();

    // 🔹 আগে থেকে Chapter আছে কিনা দেখি
    let chapterDoc = await Chapter.findOne({
      title: trimmedTitle,
      subject: subjectDoc._id,
    }).session(session);

    if (chapterDoc) {
      // পুরনো চ্যাপ্টার থাকলে → নতুন প্রশ্ন যোগ করবো
      const beforeCount = chapterDoc.questions.length;
      chapterDoc.questions.push(...questionsToAdd);
      await chapterDoc.save({ session });

      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        message: `Chapter "${trimmedTitle}" আপডেট হয়েছে। ${questionsToAdd.length}টি প্রশ্ন যোগ করা হয়েছে।`,
        data: {
          chapterId: chapterDoc._id,
          previousCount: beforeCount,
          newCount: chapterDoc.questions.length,
        },
      });
    }

    // 🔹 নতুন Chapter তৈরি
    const newChapter = new Chapter({
      title: trimmedTitle,
      grade: subjectDoc.grade,
      subject: subjectDoc._id,
      questions: questionsToAdd,
    });

    await newChapter.save({ session });

    // 🔹 Subject-এ রেফারেন্স যোগ  (টাইপ কাস্টিং ঠিকভাবে)
    subjectDoc.chapters.push({
      chapterId: newChapter._id as mongoose.Types.ObjectId,
      title: newChapter.title,
    });
    await subjectDoc.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `নতুন Chapter "${newChapter.title}" তৈরি হয়েছে এবং Subject-এ যুক্ত করা হয়েছে।`,
      data: newChapter,
    });
  } catch (err: any) {
    await session.abortTransaction();

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "একই subject-এ একই নামে Chapter আগে থেকেই আছে।",
      });
    }

    next(err);
  } finally {
    session.endSession();
  }
};
