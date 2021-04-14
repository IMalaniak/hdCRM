import { TimeStamps } from '@shared/models/base';

import { TaskPriority } from './task-priority';

export interface Task extends TimeStamps {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: number;
  CreatorId: number;
  TaskPriorityId: number;
  TaskPriority: TaskPriority;
}
