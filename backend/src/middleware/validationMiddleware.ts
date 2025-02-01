import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { TaskStatus, TaskPriority } from '../models/Task';

export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain a number'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .not().isEmpty().withMessage('Password is required'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateTaskCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Invalid task status'),
  
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Invalid task priority'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Invalid task status'),
  
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Invalid task priority'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
