import { series } from 'gulp';
import { doRun, task } from './gulpfile.functions';

const devTimeoutSeconds = 24 * 60 * 60;

task({
  name: 'server:compile',
  alias: 'sc',
  fct: doRun('./node_modules/.bin/tsc', { cwd: 'server' }),
  desc: 'Compiles *.ts => *.js'
});

task({
  name: 'server:build',
  alias: 'sb',
  fct: series('server:install', 'server:compile'),
  desc: 'Builds all server artifacts (runs tsc, npm install)'
});

const devOptions = {
  cwd: 'server',
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
  fct: doRun('./node_modules/.bin/nodemon', devOptions),
  desc: 'Start the dev server'
});
