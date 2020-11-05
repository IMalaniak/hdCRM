import 'reflect-metadata';
import { App } from './app';

App.start()
  .then(() => {
    // tslint:disable-next-line: no-console
    console.info('Application started');
  })
  .catch((error) => {
    // tslint:disable-next-line: no-console
    console.error('Uncaught exception! Application will terminate', { error });
  });
