import { NextFunction, Request, Response } from "express";
import Translation from "../models/translationModel";

interface ITranslationPayload {
    grade: number;
    question: string;
    answer: string;
}

export const getTranslation = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const data = await Translation.find();

        if (data.length < 1)
            return res
                .status(200)
                .json({ success: true, message: "কোনো translation পাওয়া যায়নি, এখনই যোগ করতে পারেন।", data: [] });

        return res.status(200).json({ success: true, message: "ডেটা সফলভাবে পাওয়া গেছে", data });
    } catch (error) {
        next(error)
    }

};

export const postTranslation = async (
    req: Request<{}, {}, ITranslationPayload>,
    res: Response,
    next: NextFunction
) => {


    try {
        const { grade, question, answer } = req.body;

        // প্রাথমিক ভ্যালিডেশন
        if (!grade || !question || !answer) {
            return res.status(400).json({
                success: false,
                message: "grade, question এবং answer অবশ্যই দিতে হবে",
                data: null,
            });
        }

        // টাইপ যাচাই
        if (typeof grade !== "number" || typeof question !== "string" || typeof answer !== "string") {
            return res.status(400).json({
                success: false,
                message: "grade সংখ্যা হতে হবে, question ও answer string হতে হবে",
                data: null,
            });
        }

        // আগে থেকে ডেটা আছে কিনা চেক
        const exist = await Translation.findOne({ grade, question: question.trim(), answer: answer.trim() });
        if (exist) {
            return res.status(409).json({ success: false, message: "এই ডেটা আগে থেকেই আছে", data: null });
        }

        
        const data = await Translation.create({ grade, question, answer });
        if (!data) {
            return res.status(500).json({ success: false, message: "translation তৈরি করতে সমস্যা হয়েছে", data: null });
        }

        
        return res.status(201).json({ success: true, message: "সফলভাবে নতুন translation যোগ হয়েছে", data });
    } catch (error) {
        next(error)
    }


};
