import { Task } from './task';
import { TaskPriority } from './task-priority';

export interface TaskDialogData {
  title: string;
  task?: Task;
  priorities: TaskPriority[];
}
