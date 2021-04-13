import { User as dbUser } from '../../src/repositories';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends dbUser {}
  }
}
