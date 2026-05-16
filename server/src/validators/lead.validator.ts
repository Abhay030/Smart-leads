import { body } from 'express-validator';

// ─── Create ───────────────────────────────────────────────────────────────────

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be: New, Contacted, Qualified, or Lost'),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be: Website, Instagram, or Referral'),
];

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be: New, Contacted, Qualified, or Lost'),

  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be: Website, Instagram, or Referral'),
];
