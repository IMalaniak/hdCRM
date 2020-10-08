import { Task } from './task';
import { TaskPriority } from './task-priority';

export class TaskDialogData {
  constructor(public priorities: TaskPriority[], public task: Task) {}
}
