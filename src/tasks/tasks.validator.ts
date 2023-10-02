import { body, ValidationChain } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

export const createValidator: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .trim()
    .isString()
    .withMessage('Title must be text'),
  body('date')
    .not()
    .isEmpty()
    .withMessage('Date is required')
    .trim()
    .isString()
    .withMessage('Date must be in a valid date format'),
  body('description')
    .trim()
    .isString()
    .withMessage('Description must be text'),
  body('priority')
    .trim()
    .isIn(Object.values(Priority))
    .withMessage(
      'Priority can only be low, normal or high',
    ),
  body('status')
    .trim()
    .isIn(Object.values(Status))
    .withMessage(
      'Status can only be todo, inProgress or completed',
    ),
];

export const updateValidator = [
  body('id')
    .not()
    .isEmpty()
    .withMessage('ID is mandatory')
    .trim()
    .isString()
    .withMessage('ID must be in a valid uuid format'),
  body('status')
    .trim()
    .isIn(Object.values(Status))
    .withMessage(
      'Status can only be todo, inProgress or completed',
    ),
];
