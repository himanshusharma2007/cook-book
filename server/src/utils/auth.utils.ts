import { Request } from 'express';

/**
 * Extracts the user ID from the authenticated request.
 * @param req - Express request object with authenticated user
 * @returns User ID
 */
export function getUserId(req: Request): number {
  return (req.user as any).id;
}
