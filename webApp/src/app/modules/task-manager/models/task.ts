import { ApiResponse } from '@/shared';

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: number;
  CreatorId: number;
}

export interface TaskServerResponse extends ApiResponse {
  list: Task[];
}
