import { User as dbUser } from '../src/models';

declare global {
  namespace Express {
      interface User extends dbUser {}
  }
}