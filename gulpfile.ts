import { parallel, series } from 'gulp';

import { doRun, generateTestTask, lint, task } from './gulpfile.functions';

const modules = ['server', 'web', 'gulp'];
const artifactModules = ['server', 'web'];

modules.forEach((it) => {
  const cwd = it === 'gulp' ? '.' : it;
  task({
    name: `${it}:lint`,
    fct: lint(cwd, false),
    desc: `Lints ${it}`
  });

  task({
    name: `${it}:format`,
    alias: `${it[0]}f`, // e.g. 'wf' === 'web:format'
    fct: lint(cwd, true),
    desc: `Formats (force --fix for linting) ${it}`
  });

  task({
    name: `${it}:install`,
    alias: `${it[0]}i`, // e.g. 'wi' === 'web:install'
    fct: doRun('npm install', { cwd }),
    desc: `Runs 'npm install' on ${it}`
  });

  // task({
  //   name: `${it}:audit`,
  //   fct: doRun('npm audit fix', { cwd }),
  //   desc: `Runs 'npm audit fix' on ${it}`,
  // });
});

artifactModules.forEach((it) => {
  task({
    name: `${it}:pre-build`,
    fct: series(`${it}:lint`),
    desc: `Lints ${it}`
  });

  generateTestTask(it, 'unit');
});

// tslint:disable:no-var-requires
require('./gulpfile.web');
require('./gulpfile.server');
// tslint:enable:no-var-requires

/**
 * "All" Tasks
 */

task({
  name: 'testAll',
  fct: series('server:exec-unit-test', 'web:exec-unit-test')
});

task({
  name: 'lintAll',
  fct: parallel(modules.map((it) => `${it}:lint`))
});

task({
  name: 'formatAll',
  alias: 'fa',
  fct: parallel(modules.map((it) => `${it}:format`))
});

task({
  name: 'installAll',
  alias: 'ia',
  fct: parallel(modules.map((it) => `${it}:install`)),
  desc: "runs 'npm install' on all submodules"
});

// task({
//   name: 'auditAll',
//   fct: parallel(modules.map((it) => `${it}:audit`)),
//   desc: "runs 'npm audit fix' on all submodules",
// });

task({
  name: 'compileAll',
  fct: parallel(artifactModules.map((it) => `${it}:compile`))
});

task({
  name: 'buildAll',
  fct: parallel(artifactModules.map((it) => `${it}:build`))
});

task({
  name: 'buildAllProd',
  fct: parallel(artifactModules.map((it) => `${it}:buildProd`))
});
