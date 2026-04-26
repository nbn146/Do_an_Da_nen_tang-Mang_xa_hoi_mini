import type { Response } from "express";

export const successResponse = (
  res: Response,
  data: any = null,
  message = "Success",
  status = 200,
  meta: any = null,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};

export const errorResponse = (
  res: Response,
  message = "Error",
  status = 500,
  error = "SERVER_ERROR",
) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
