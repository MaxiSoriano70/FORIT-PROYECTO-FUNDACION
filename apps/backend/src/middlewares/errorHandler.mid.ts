import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
    status?: number;
}


const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err);
    const message = err.message || "Server Error";
    const status = err.status || 500;

    res.status(status).json({
        error: message,
        method: req.method,
        url: req.url,
    });
};

export default errorHandler;
