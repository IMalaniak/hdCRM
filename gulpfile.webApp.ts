import { series } from 'gulp';
import { doRun, task } from './gulpfile.functions';

const cwd = { cwd: 'webApp' };
const devTimeoutSeconds = 24 * 60 * 60;
const devOptions = {
  commandTimeoutSeconds: devTimeoutSeconds
};

task({
  name: 'webApp:checkTypes',
  fct: doRun('node_modules/.bin/tsc --noEmit', { ...cwd, ...devOptions }),
  desc: 'Check the webApp code typings (run tsc)'
});

task({
  name: 'webApp:compile',
  fct: series(
    'webApp:checkTypes',
    doRun('NODE_ENV=production node_modules/.bin/webpack', {
      ...cwd,
      ...devOptions
    })
  ),
  desc: 'Build the webApp application (run webpack)'
});

task({
  name: 'webApp:compile-dev',
  fct: series(
    'webApp:checkTypes',
    doRun('NODE_ENV=development node_modules/.bin/webpack', {
      ...cwd,
      ...devOptions
    })
  ),
  desc: 'Build the webApp application in development mode (run webpack)'
});

task({
  name: 'webApp:build',
  fct: series('webApp:install', 'webApp:compile'),
  desc: 'Install all dependencies and compile the application'
});

task({
  name: 'webApp:build-dev',
  fct: series('webApp:install', 'webApp:compile-dev'),
  desc: 'Install all dependencies and compile the application in development mode'
});

task({
  name: 'webApp:dev',
  alias: 'cd',
  fct: series(
    'webApp:checkTypes',
    doRun(
      'NODE_ENV=development node_modules/.bin/webpack-dev-server --host 0.0.0.0 --inline --watch --hot --port 3333',
      { ...cwd, ...devOptions }
    )
  ),
  desc: 'Start the webApp dev server on port 3333'
});
