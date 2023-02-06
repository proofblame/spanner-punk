import { NextFunction, Request, Response } from "express";

interface Error extends ErrorEvent {
  name: string;
  message: string;
  stack?: string;
  statusCode: number;
}

const centralErrorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
};
export default centralErrorsHandler;
