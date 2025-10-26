import { Schema, model, type InferSchemaType } from "mongoose";

const translatorSchema = new Schema({
    grade: { type: Number, required: [true, "Grade/class is required"] },
    question: { type: String, required: [true, "Question is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
}, { timestamps: true });

// Unique index to prevent duplicates
translatorSchema.index({ grade: 1, question: 1, answer: 1 }, { unique: true });

type ITranslatorModel = InferSchemaType<typeof translatorSchema>;

const Translation = model<ITranslatorModel>("Translation", translatorSchema);

export default Translation;
