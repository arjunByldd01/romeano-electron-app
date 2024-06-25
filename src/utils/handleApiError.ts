import axios, { type AxiosError } from "axios";

export interface IApiError {
  data: unknown;
  message: string;
  name: string;
  statusCode: number;
}

class ApiError extends Error {
  data: unknown;
  statusCode: number | undefined;
  constructor(message: string, data?: unknown, statusCode?: number) {
    super(message);
    this.data = data;
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const handleApiError = (
  operation: string,
  error: AxiosError | { message: string }
) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new ApiError(
        `${operation}: ${error.message}`,
        error.response.data,
        error.response.status
      );
    } else {
      throw new ApiError(
        `Network or configuration error in ${operation}: ${error.message}`
      );
    }
  } else {
    throw new ApiError(`Unexpected error in ${operation}: ${error?.message}`);
  }
};

export { handleApiError };
