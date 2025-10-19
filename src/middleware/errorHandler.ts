import { NextFunction, Request, Response } from "express";

export function error(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack);
    res.status(500).send({ message: "internal server error" });
}