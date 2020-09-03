import { Task, TaskPriority, User } from '@/models';
import { Logger } from '@overnightjs/logger';
import { IncludeOptions } from 'sequelize/types';

export class TaskDBController {
  public includes: IncludeOptions[] = [
    {
      model: TaskPriority
    }
  ];

  public getById(taskId: number | string): Promise<Task> {
    Logger.Info(`Selecting task by id: ${taskId}...`);
    return Task.findByPk(taskId, {
      include: this.includes
    });
  }

  public getAll(currentUser: User): Promise<Task[]> {
    Logger.Info(`Selecting all tasks...`);

    return Task.findAll({
      where: {
        CreatorId: currentUser.id
      },
      include: this.includes
    });
  }

  public create(body: Partial<Task>): Promise<Task> {
    Logger.Info(`Creating new task...`);
    return Task.create(body);
  }

  public updateOne(task: Partial<Task>): Promise<[number, Task[]]> {
    Logger.Info(`Updating task by id: ${task.id}...`);
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
    Logger.Info(`Deleting task by id: ${id}...`);
    return Task.destroy({
      where: { id }
    });
  }

  public getPrioriities(): Promise<TaskPriority[]> {
    Logger.Info(`Selecting all priorities...`);
    return TaskPriority.findAll();
  }
}
