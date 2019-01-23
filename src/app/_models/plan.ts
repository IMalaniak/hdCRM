import { User } from './user';
import { Asset } from './asset';

export class Plan {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  progress: number;
  CreatorId: number;
  Creator: User;
  Participants: User[];
  Documents: Asset[];
  createdAt: string;
  updatedAt: string;
}
