import { Role } from './role';
import { State } from './state';
import { Asset } from './asset';

export class User {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  Roles: Role[];
  defaultLang: string;
  StateId: number;
  State: State;
  avatar: Asset;
  selected: boolean;
  token?: string;
}
