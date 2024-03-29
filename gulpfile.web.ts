import { series } from 'gulp';
import { copy, doRun, task } from './gulpfile.functions';

const cwd = { cwd: `${__dirname}/web` };
const devTimeoutSeconds = 24 * 60 * 60;
const devOptions = {
  commandTimeoutSeconds: devTimeoutSeconds
};

const copyBSIcons = () => {
  return copy('node_modules/bootstrap-icons/icons/*.svg', 'src/assets/images/bs-icons', cwd);
};

task({
  name: 'web:compile',
  fct: doRun('node_modules/.bin/ng build --configuration production', {
    ...cwd,
    ...devOptions
  }),
  desc: 'Build the web application (run ng build)'
});

task({
  name: 'web:compile-dev',
  fct: doRun('node_modules/.bin/ng build', {
    ...cwd,
    ...devOptions
  }),
  desc: 'Build the web application in development mode'
});

task({
  name: 'web:build',
  fct: series('web:install', 'web:compile'),
  desc: 'Install all dependencies and compile the application'
});

task({
  name: 'web:buildProd',
  fct: series('web:unit-test', 'web:compile'),
  desc: 'Install all dependencies, runs all unit tests and then compile the application to the production'
});

task({
  name: 'web:build-dev',
  fct: series('web:install', 'web:compile-dev'),
  desc: 'Install all dependencies and compile the application in development mode'
});

task({
  name: 'web:dev-assets',
  alias: 'wda',
  fct: copyBSIcons,
  desc: 'Start the web dev server on port 3333'
});

task({
  name: 'web:dev',
  alias: 'wd',
  fct: series('web:dev-assets', doRun('node_modules/.bin/ng serve -o', { ...cwd, ...devOptions })),
  desc: 'Start the web dev server on port 3333'
});
