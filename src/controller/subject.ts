import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Subject from "../models/subjectModel";
import Grade from "../models/gradeModel";

interface ISubjectPayload {
  name: string;
  grade: number;
  chapters?: string[];
}

interface GradeParam {
  grade: string;
}

interface SubjectParam {
  id: string;
}

/* =========================
   ১️⃣ Create Subject (Single)
   ========================= */
export const createSubject = async (
  req: Request<{}, {}, ISubjectPayload>,
  res: Response,
  next: NextFunction
) => {


  const session = await mongoose.startSession();
  try {
    const { name, grade, chapters = [] } = req.body;

    if (!name?.trim() || typeof grade !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid payload. 'name' এবং 'grade' লাগবে।",
      });
    }

    const trimmedName = name.trim();

    //  গ্রেড আগে খুঁজে বের করো
    const gradeDoc = await Grade.findOne({ grade });
    if (!gradeDoc) {
      return res.status(404).json({
        success: false,
        message: `Grade ${grade} পাওয়া যায়নি।`,
      });
    }

    session.startTransaction();

    //  ডুপ্লিকেট সাবজেক্ট চেক করো
    const existing = await Subject.findOne({
      name: trimmedName,
      grade: gradeDoc._id,
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: `Subject "${trimmedName}" আগেই আছে grade ${grade}-এ।`,
      });
    }

    //  সাবজেক্ট তৈরি করো
    const createdSubject = new Subject({
      name: trimmedName,
      grade: gradeDoc._id,
      chapters,
    });
    await createdSubject.save({ session });

    //  Grade এ subject যোগ করো
  gradeDoc.subjects.push({
  subjectId: createdSubject._id as mongoose.Types.ObjectId,
  name: createdSubject.name,
});
    await gradeDoc.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `Subject "${createdSubject.name}" তৈরি হয়েছে grade ${gradeDoc.title}-এ।`,
      data: createdSubject,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/* =========================
   ২️⃣ Get Subjects by Grade
   ========================= */
export const getSubjectsByGrade = async (
  req: Request<GradeParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade } = req.params;

   

    if (typeof grade !=="string") {
      return res.status(400).json({
        success: false,
        message: "Grade প্যারামিটারটি সঠিক সংখ্যা নয়।",
      });
    }

    const gradeDoc = await Grade.findOne({_id:  grade }).populate({
      path: "subjects.subjectId",
      select: "name chapters",
      populate: { path: "chapters", select: "title" },
    });

    if (!gradeDoc) {
      return res.status(404).json({
        success: false,
        message: `Grade ${grade} পাওয়া যায়নি।`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Grade ${gradeDoc.title}-এর subject লিস্ট পাওয়া গেছে।`,
      data: gradeDoc.subjects,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   ৩️⃣ Delete Subject (with transaction)
   ========================= */
export const deleteSubject = async (
  req: Request<SubjectParam>,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    session.startTransaction();

    const subjectDoc = await Subject.findById(id).session(session);
    if (!subjectDoc) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Subject পাওয়া যায়নি।",
      });
    }

    //  Grade থেকে subject সরাও
    await Grade.updateOne(
      { _id: subjectDoc.grade },
      { $pull: { subjects: { subjectId: subjectDoc._id } } },
      { session }
    );

    //  Subject মুছে ফেলো
    await Subject.deleteOne({ _id: subjectDoc._id }, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: `Subject "${subjectDoc.name}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
