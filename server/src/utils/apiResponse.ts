import { Response } from 'express';

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && data !== null ? { data } : {}),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(res: Response, message: string, statusCode = 500): void {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success',
): void {
  const totalPages = Math.ceil(total / limit);
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
  res.status(200).json(response);
}
