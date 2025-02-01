import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log all cookies for debugging
  console.log('Received cookies:', req.cookies);

  const token = req.cookies.token;

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    ) as { userId: string };

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    res.status(401).json({
      message: "Invalid or expired token",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const errorMiddleware = (err: Error, _: Request, res: Response) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};
