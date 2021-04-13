import { expect } from 'chai';
import { FileConditionBuilder, filesOfProject } from 'tsarch';

import { doesNotMatchRegex } from './utils/architectureHelpers';

describe('Architecture tests', () => {
  let files: FileConditionBuilder;

  before(() => {
    files = filesOfProject(__dirname + '/../tsconfig.json');
  });

  it('does not find a violation for controllers', async () => {
    const violations = await files
      .inFolder('controllers')
      .matchingPattern(doesNotMatchRegex(['utils', 'index.ts']))
      .should()
      .matchPattern('.*.controller.ts|.*.controller.spec.ts')
      .check();

    expect(violations).deep.equal([]);
  });

  it('does not find a violation for services', async () => {
    const violations = await files
      .inFolder('services')
      .matchingPattern(doesNotMatchRegex(['utils', 'index.ts']))
      .should()
      .matchPattern('.*.service.ts|.*.service.spec.ts')
      .check();

    expect(violations).deep.equal([]);
  });

  it('does not find a violation for routes', async () => {
    const violations = await files
      .inFolder('routes')
      .matchingPattern(doesNotMatchRegex(['index.ts']))
      .should()
      .matchPattern('.*.routes.ts|.*.routes.spec.ts')
      .check();

    expect(violations).deep.equal([]);
  });

  it('does not find a violation for errors', async () => {
    const violations = await files
      .inFolder('errors')
      .matchingPattern(doesNotMatchRegex(['index.ts']))
      .should()
      .matchPattern('.*-error.ts')
      .check();

    expect(violations).deep.equal([]);
  });

  it('does not find a violation for constants', async () => {
    const violations = await files
      .inFolder('constants')
      .matchingPattern(doesNotMatchRegex(['index.ts']))
      .should()
      .matchPattern('.*.constants.ts|.*.enum.ts')
      .check();

    expect(violations).deep.equal([]);
  });

  it('layers in the right direction', async () => {
    const violations = await files.inFolder('services').shouldNot().dependOnFiles().inFolder('controllers').check();
    const violations2 = await files.inFolder('routes').shouldNot().dependOnFiles().inFolder('controllers').check();

    expect(violations).deep.equal([]);
    expect(violations2).deep.equal([]);
  });
});
