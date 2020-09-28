import { series } from 'gulp';
import { doRun, task } from './gulpfile.functions';

const devTimeoutSeconds = 24 * 60 * 60;

task({
  name: 'server:compile',
  alias: 'sc',
  fct: doRun('node_modules/.bin/tsc --project tsconfig.prod.json', { cwd: `${__dirname}/server` }),
  desc: 'Compiles *.ts => *.js'
});

task({
  name: 'server:build',
  alias: 'sb',
  fct: series('server:install', 'server:compile'),
  desc: 'Builds all server artifacts (runs tsc, npm install)'
});

task({
  name: 'server:buildProd',
  alias: 'sb',
  fct: series('server:unit-test', 'server:compile'),
  desc: 'Runs all server unit tests and then builds all server artifacts'
});

const devOptions = {
  cwd: `${__dirname}/server`,
  commandTimeoutSeconds: devTimeoutSeconds
};

task({
  name: 'server:start',
  fct: series('server:compile', doRun('node dist/index.js', devOptions)),
  desc: 'Starts the server'
});

task({
  name: 'server:dev',
  alias: 'sd',
  fct: doRun('node_modules/.bin/nodemon', devOptions),
  desc: 'Start the dev server'
});
