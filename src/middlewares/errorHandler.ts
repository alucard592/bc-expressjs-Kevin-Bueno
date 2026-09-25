import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const issueMessages = err.issues
      .map((issue) => `${issue.path.join('.') || 'campo'}: ${issue.message}`)
      .join('; ');
    res.status(400).json({ error: `Validación fallida - ${issueMessages}` });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
