import { Response } from "express";

// Input type
type SuccessResponse = {
  status: "success";
  data: unknown;
};

type FailResponse = {
  status: "fail";
  message: string;
};

type ErrorResponse = {
  status: "error";
  message: string;
  error: unknown;
};

type ResponseInput = SuccessResponse | FailResponse | ErrorResponse;

// Function
export const sendResponse = (
  res: Response,
  statusCode: number,
  input: ResponseInput
): void => {
  let response: {
    status: string;
    data?: unknown;
    message?: string;
    error?: unknown;
  };

  if (input.status === "success") {
    response = { status: input.status, data: input.data };
  } else if (input.status === "fail") {
    response = { status: input.status, message: input.message };
  } else if (input.status === "error") {
    response = {
      status: input.status,
      message: input.message,
      error: input.error,
    };
  } else {
    throw new Error("Invalid status type");
  }

  res.status(statusCode).json(response);
};
