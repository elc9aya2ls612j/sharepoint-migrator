import fs from 'fs-extra'
import {main}  from '../index.js';
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

  it('should not include a docx file in the end', async () => {
    await main("example-site/config/analytics.docx", "example-site/global/analytics.xlsx", "example-site/placeholders.xlsx");
    let exists = await fs.existsSync(`./../temp-${date}/example-site/config/analytics.docx`);
    expect(exists).to.equal(false);
  });

  it('should include a xlsx file in the end', async () => {
    await main("example-site/config/analytics.docx", "example-site/global/analytics.xlsx", "example-site/placeholders.xlsx");
    let exists = await fs.existsSync(`./../temp-${date}/example-site/global/analytics.xlsx`);
    expect(exists).to.equal(true);
  });

  it('should include a placeholders file in the end', async () => {
    await main("example-site/config/analytics.docx", "example-site/global/analytics.xlsx", "example-site/placeholders.xlsx");
    let exists = await fs.existsSync(`./../temp-${date}/example-site/placeholders.xlsx`);
    expect(exists).to.equal(true);
  });
});