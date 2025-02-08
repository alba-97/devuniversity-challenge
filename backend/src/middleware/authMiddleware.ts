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
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    ) as { userId: string };

    req.user = { id: decoded.userId };

    next();
  } catch (error) {
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
