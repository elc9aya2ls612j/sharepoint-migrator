import fs from 'fs-extra'
import { expect } from 'chai';
/* eslint-env: mocha */

describe('Test Sharepoint Migration', () => {
  let tmpdir;
  let date = Date.now();

  beforeEach(() => {
    // create temp folder
    tmpdir = './test/temp-' + date;
    fs.mkdirSync(tmpdir);
    // copy test fixtures recursively
    fs.copySync('./test/fixtures', tmpdir);
    // change working directory to temp folder
    process.chdir(tmpdir);
  });

  afterEach(() => {
    // change working directory back to original
    process.chdir('../..');
    // remove temp folder
    fs.removeSync(tmpdir);
  });

  it('should run a test', () => {
    console.log('Test');
  });

  it('should not include a docx file in the end', async () => {
    let exists = await fs.existsSync(`./../temp-${date}/example-site/config/analytics.docx`);
    expect(exists).to.equal(false);
  });
});