import { User as dbUser } from '../../src/repositories';

declare global {
  namespace Express {
    interface User extends dbUser {}
  }
}
