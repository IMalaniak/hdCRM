import { parallel, series } from 'gulp';

import { doRun, lint, task } from './gulpfile.functions';

const modules = ['server', 'webApp', 'gulp'];
const artifactModules = ['server', 'webApp'];

modules.forEach((it) => {
  const cwd = it === 'gulp' ? '.' : it;
  task({
    name: `${it}:lint`,
    fct: lint(cwd, false),
    desc: `Lints ${it}`
  });

  task({
    name: `${it}:format`,
    alias: `${it[0]}f`, // e.g. 'wf' === 'webApp:format'
    fct: lint(cwd, true),
    desc: `Formats (force --fix for linting) ${it}`
  });

  task({
    name: `${it}:install`,
    alias: `${it[0]}i`, // e.g. 'wi' === 'webApp:install'
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
});

// tslint:disable:no-var-requires
require('./gulpfile.webApp');
require('./gulpfile.server');
// tslint:enable:no-var-requires

/**
 * "All" Tasks
 */

// task({
//   name: 'testAll',
//   fct: series('webApp:test', 'server:test'),
// });

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
  name: 'buildAll',
  fct: parallel(artifactModules.map((it) => `${it}:build`))
});
