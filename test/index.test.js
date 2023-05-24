import fs from 'fs-extra'
import {main}  from '../index.js';
/* eslint-env: mocha */

describe('Test Sharepoint Migration', () => {
  let tmpdir;

  beforeEach(() => {
    // create temp folder
    tmpdir = './test/temp-' + Date.now();
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

  it('should run a test', async () => {
    await main("example-site/config/analytics.docx", "example-site/config/analytics.xlsx", "example-site/placeholders.xlsx");
    console.log('Test');
  });
});