import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { UpdateResult } from 'typeorm';

import { Task } from './tasks.entity';
import { AppDataSource } from '../../index';

class TasksController {
  // Method for the GET route
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    // declare a variable to hold all tasks
    let allTasks: Task[];

    // fetch all tasks using the repository
    try {
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      // convert the tasks instance into an array of objects
      allTasks = instanceToPlain(allTasks) as Task[];

      return res.json(allTasks).status(200);
    } catch (error) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  // Method for the POST route
  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    // create a new instance of the Task
    // const newTask = new Task();

    // add the required properties to the Task object
    // newTask.title = req.body.title;
    // newTask.date = req.body.date;
    // newTask.description = req.body.description;
    // newTask.priority = req.body.priority;
    // newTask.status = req.body.status;

    /* create a new instance of the Task + add the required properties to the Task object */
    const newTask: Task = req.body as Task;

    // add the new task to the database
    let createdTask: Task;
    try {
      createdTask =
        await AppDataSource.getRepository(Task).save(
          newTask,
        );
      // convert the task instance to an object
      createdTask = instanceToPlain(createdTask) as Task;
      // send back a valid response to the request
      return res.json(createdTask).status(201);
    } catch (error) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  // Method for the PUT route
  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    let task: Task | null;

    try {
      // check whether task exists in the database
      task = await AppDataSource.getRepository(
        Task,
      ).findOne({ where: { id: req.body.id } });
    } catch (error) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
    // return 400 if task is null
    if (!task) {
      return res
        .status(404)
        .json({ error: 'Task does not exist' });
    }

    // declare variable for updatedTask
    let updatedTask: UpdateResult;

    // update the task
    try {
      updatedTask = await AppDataSource.getRepository(
        Task,
      ).update(
        req.body.id,
        plainToInstance(Task, { status: req.body.status }),
      );

      // convert the updatedTask instance into an object and return it
      updatedTask = instanceToPlain(
        updatedTask,
      ) as UpdateResult;
      return res.json(updatedTask).status(201);
    } catch (error) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }
}

export const taskController = new TasksController();
