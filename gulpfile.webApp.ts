import { series } from 'gulp';
import { doRun, task } from './gulpfile.functions';

const cwd = { cwd: 'webApp' };
const devTimeoutSeconds = 24 * 60 * 60;
const devOptions = {
  commandTimeoutSeconds: devTimeoutSeconds
};

task({
  name: 'webApp:compile',
  fct: doRun('node_modules/.bin/ng build --prod', {
    ...cwd,
    ...devOptions
  }),
  desc: 'Build the webApp application (run ng build)'
});

task({
  name: 'webApp:compile-dev',
  fct: doRun('node_modules/.bin/ng build', {
    ...cwd,
    ...devOptions
  }),
  desc: 'Build the webApp application in development mode'
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
  fct: doRun('node_modules/.bin/ng serve -o', { ...cwd, ...devOptions }),
  desc: 'Start the webApp dev server on port 3333'
});
