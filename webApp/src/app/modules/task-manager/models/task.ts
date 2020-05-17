import { TaskPriority } from './task-priority';

export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  priority: number;
  CreatorId: number;
  TaskPriorityId: number;
  TaskPriority: TaskPriority;
}
