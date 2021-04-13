import 'reflect-metadata';
import Container from 'typedi';

import { App } from './app';
import { Logger } from './utils/Logger';

const logger = Container.get(Logger);

App.start()
  .then(() => {
    logger.info('Application started');
  })
  .catch((error: Error) => {
    logger.error(`Uncaught exception! Application will terminate, ${error.message}`);
  });
