import { IncludeOptions } from 'sequelize/types';
import { Service } from 'typedi';

import { Task, TaskAttributes, TaskCreationAttributes, TaskPriority, User } from '../models';

@Service()
export class TaskController {
  public includes: IncludeOptions[] = [
    {
      model: TaskPriority as any
    }
  ];

  public getById(taskId: number | string): Promise<Task> {
    // Logger.Info(`Selecting task by id: ${taskId}...`);
    return Task.findByPk(taskId, {
      include: this.includes
    });
  }

  public getAll(currentUser: User): Promise<Task[]> {
    // Logger.Info(`Selecting all tasks...`);

    return Task.findAll({
      where: {
        CreatorId: currentUser.id
      },
      include: this.includes
    });
  }

  public create(body: TaskCreationAttributes): Promise<Task> {
    // Logger.Info(`Creating new task...`);
    return Task.create(body);
  }

  public updateOne(task: TaskAttributes): Promise<[number, Task[]]> {
    // Logger.Info(`Updating task by id: ${task.id}...`);
    return Task.update(
      {
        ...task
      },
      {
        where: { id: task.id }
      }
    );
  }

  public deleteTask(id: number | string | number[] | string[]) {
    // Logger.Info(`Deleting task by id: ${id}...`);
    return Task.destroy({
      where: { id }
    });
  }

  public getPrioriities(): Promise<TaskPriority[]> {
    // Logger.Info(`Selecting all priorities...`);
    return TaskPriority.findAll();
  }
}
