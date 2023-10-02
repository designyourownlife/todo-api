import { Router } from 'express';

import { taskController } from './tasks.controller';
import {
  createValidator,
  updateValidator,
} from './tasks.validator';

// fire the router function to create a new router
export const tasksRouter: Router = Router();

// create a GET route
tasksRouter.get('/tasks', taskController.getAll);

// create a POST route
tasksRouter.post(
  '/tasks',
  createValidator,
  taskController.create,
);

// create a PUT route
tasksRouter.put(
  '/tasks',
  updateValidator,
  taskController.update,
);
