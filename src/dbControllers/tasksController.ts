import * as db from '../models';
import { Logger } from '@overnightjs/logger';

export class TaskDBController {
  public getById(taskId: number | string): Promise<db.Task> {
    Logger.Info(`Selecting task by id: ${taskId}...`);
    return db.Task.findByPk(taskId);
  }

  public getAll(currentUser: db.User): Promise<db.Task[]> {
    Logger.Info(`Selecting all tasks...`);

    return db.Task.findAll({
      where: {
        CreatorId: currentUser.id
      }
    });
  }

  public create(body: db.Task): Promise<db.Task> {
    Logger.Info(`Creating new task...`);
    return db.Task.create(body);
  }

  public updateOne(task: db.Task): Promise<[number, db.Task[]]> {
    Logger.Info(`Updating task by id: ${task.id}...`);
    return db.Task.update(
      {
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
        priority: task.priority,
        CreatorId: task.CreatorId
      },
      {
        where: { id: task.id }
      }
    );
  }

  public deleteOne(id: number | string) {
    Logger.Info(`Deleting task by id: ${id}...`);
    return db.Task.destroy({
      where: { id }
    });
  }

  public getPrioriities(): Promise<db.TaskPriority[]> {
    Logger.Info(`Selecting all priorities...`);
    return db.TaskPriority.findAll();
  }
}
