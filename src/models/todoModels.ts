import { Schema, Document, model } from "mongoose";

interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}


const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: [true, "title needed"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });
const Todo = model<ITodo>("Todos", todoSchema);
export default Todo;
