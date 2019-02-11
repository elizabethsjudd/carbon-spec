/**
 * Copyright IBM Corp. 2018, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { TestParser } from '../../../test-parser';
import { accordionTests } from '../requirements';

const ACCORDION_HTML_TO_TEST = path.join(
  __dirname,
  './fixtures/accordion.html'
);

/**
 * Variable representing a HTML of a component. Includes _entire_ HTML document.
 * @type {string}
 */
const accordionHTML = fs.readFileSync(ACCORDION_HTML_TO_TEST, 'utf8');

/**
 * Options when creating the window/document from the HTML that's being tested
 * @type {object}
 */
const JSDOMoptions = {
  runScripts: 'dangerously',
  resources: 'usable',
};

/**
 * Adjusts global window and document to be from the HTML we're gonna test
 */
const { window } = new JSDOM(accordionHTML, JSDOMoptions);

describe('Runs Accordion tests on fixture demo', () => {
  beforeAll(done => {
    window.addEventListener('load', () => {
      done();
    });
  });

  TestParser(accordionTests(), window);
});
