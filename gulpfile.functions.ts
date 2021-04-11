import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import { series, src, dest } from 'gulp';

const DEFAULT_COMMAND_TIMEOUT_SECONDS = 1800;
export interface RunOptions {
  commandTimeoutSeconds?: number;
  cwd?: string;
  env?: { [key: string]: string };
}

function print(value: string) {
  if (value) {
    process.stdout.write(value);
  }
}

function printError(value: string) {
  if (value) {
    process.stderr.write(value);
  }
}

export function doRun(command, options: RunOptions = {}): () => Promise<void> {
  return async () => {
    print(`doRun: command '${command}' with options ${JSON.stringify(options)}`);
    const env = { ...process.env, ...(options.env || {}) };

    return new Promise((resolve, reject) => {
      const process = exec(
        command,
        {
          ...options,
          timeout: (options.commandTimeoutSeconds || DEFAULT_COMMAND_TIMEOUT_SECONDS) * 1000,
          killSignal: 'SIGKILL',
          maxBuffer: 100 * 1000 * 1000,
          env
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
      process.stdout.on('data', (data) => {
        print(data);
      });
      process.stderr.on('data', (data) => {
        printError(data.toString());
      });
    });
  };
}

function findSourceFoldersIn(dir) {
  const toSearch = ['src', 'test'];
  return toSearch.filter((path) => {
    return fs.existsSync(`${dir}/${path}`);
  });
}

function tslint({ cwd, fix = false }) {
  const fixParam = fix ? '--fix --force' : '';
  const prettierConfigPath = cwd === '.' ? '' : '../';
  const prettier = `node_modules/.bin/prettier ${
    fix ? '--write' : '--check'
  } --config ${prettierConfigPath}.prettierrc --ignore-path ${prettierConfigPath}.prettierignore '**/*.{json,ts,html,scss}'`;
  return doRun(`node_modules/.bin/tslint -p tsconfig.json -c tslint.json ${fixParam} && ${prettier}`, {
    cwd,
    commandTimeoutSeconds: 300
  });
}

function eslint({ cwd, fix = false }: { cwd: string; fix?: boolean }) {
  const path = cwd === '.' ? '*.ts' : '.';
  const baseExtensions = '--ext .json,.ts';
  const ext = cwd === 'client' ? `${baseExtensions},.tsx` : baseExtensions;
  const ignorePath = './.eslintignore';
  const fixParam = fix ? '--fix' : '';
  return doRun(`npx eslint ${fixParam} ${path} ${ext} --ignore-path '${ignorePath}'`, { cwd });
}

export function lint(cwd, fix = false) {
  if (fs.existsSync(`${cwd}/tsconfig.json`) && fs.existsSync(`${cwd}/tslint.json`)) {
    return tslint({ cwd, fix });
  }
  return eslint({ cwd, fix });
}

export function mkdir(subdir, runOptions) {
  execSync(`mkdir -p ${subdir}`, runOptions);
}

export function cp(from: string, to: string, runOptions) {
  execSync(`cp -r ${from} ${to}`, runOptions);
}

export function copy(source: string, destination: string, runOptions) {
  return src(source, runOptions).pipe(dest(destination, runOptions));
}

export function task(options: { name: string; desc?: string; fct: any; alias?: string }) {
  const { name, desc, fct, alias } = options;
  fct.description = desc || '';
  gulp.task(name, fct);
  if (alias) {
    gulp.task(alias, fct);
  }
}

export function mochaRunner({
  testStage,
  cwd,
  baseDir = 'tests',
  coverage = true
}: {
  testStage: string;
  cwd: string;
  baseDir?: string;
  coverage?: boolean;
}): () => Promise<void> {
  const pattern = baseDir === 'tests' ? `${baseDir}/${testStage}/*.spec.?s?(x)` : `${baseDir}/**/*.spec.?s?(x)`;
  const mocha = `node_modules/.bin/mocha '${pattern}' --exit${testStage === 'architecture' ? ' --timeout 10000' : ''}`;
  const nyc = `${coverage ? 'node_modules/.bin/nyc' : ''}`;
  const command = `NODE_PATH=./ NODE_ENV=test ${nyc} ${mocha}`;

  return doRun(command, {
    cwd,
    commandTimeoutSeconds: 5 * 60
  });
}

export function generateTestTask(module: string, testStage: string, baseDir?: string) {
  task({
    name: `${module}:exec-${testStage}-test`,
    fct:
      module === 'web'
        ? doRun('node_modules/.bin/ng test --watch=false --browsers ChromeHeadless', { cwd: module })
        : mochaRunner({
            testStage,
            cwd: module,
            baseDir,
            coverage: testStage !== 'architecture'
          }),
    desc: `Runs all ${testStage} tests on ${module} (without npm install beforehand)`
  });

  task({
    name: `${module}:${testStage}-test`,
    fct: series(`${module}:install`, `${module}:exec-${testStage}-test`),
    desc: `Runs all ${testStage} tests on ${module}`
  });
}
