import { NextFunction, Request, Response } from "express";
import Todo from "../models/todoModels";

const getTodos = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const todos = await Todo.find();
        res.status(200).json({ data:todos, message: 'successful todo finding', status: 200 });
        console.log(todos);

    } catch (error) {
        next(error);
    }

};

const postTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newTask = await Todo.create(req.body);
        res.status(201).json({ newTask, message: 'successful todo creation', status: 201 });
    } catch (error) {
        next(error);
    }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const finedTask = await Todo.findById(id);
        res.status(200).json({ finedTask, message: 'successful todo finding', status: 200 });
    } catch (error) {
        next(error);
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateTask = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updateTask) {  res.status(401).json({message:'Not found'})        }
        res.status(200).json({ updateTask, message: 'successful todo updating', status: 200 });
    } catch (error) {
        next(error);
    }
}

const deleteData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedTask = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Todo not found', status: 404 });
    }

    res.status(200).json({
      deletedTask,
      message: 'Todo deleted successfully',
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const testError = (req: Request, res: Response, next: NextFunction) => {
  try {
    // simulate an error
    throw new Error(" Test error triggered successfully!");
  } catch (error) {
    next(error);
  }
};

export { getTodos, postTodos, findOne, update,deleteData };       
