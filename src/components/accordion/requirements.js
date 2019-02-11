/**
 * @fileOverview Exportable tests that match the Feature/Scenario pairs in accordion/requirements.feature
 */

/**
 * Accordion user test configurations
 * @typedef {object} accordionTestConfig
 * @property {accordionElements} selectors - Selectors to grab each element for a accordion component
 */
const defaults = {
  activeClass: 'bx--accordion__item--active',
  selectors: {
    root: 'ul',
    sections: 'li',
    header: 'button',
    panel: '.bx--accordion__content',
  },
};

/**
 * Grabs Accordion component from a DOM
 * @param {DocumentFragment} docFragment - JavaScript document or JSDOM fragment
 * @param {accordionElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getAccordion = (docFragment, selectors) => {
  const accordion = docFragment.querySelector(selectors.root);
  const sections = accordion.querySelectorAll(selectors.sections);

  return {
    accordion,
    sections,
  };
};

/**
 * Grabs Accordion component elements from a DOM
 * @param {DocumentFragment} docFragment - JavaScript document or JSDOM fragment
 * @param {accordionElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getAccordionSection = (docFragment, selectors) => {
  const container = docFragment.matches(selectors.sections)
    ? docFragment
    : docFragment.querySelector(selectors.sections);
  const header = container.querySelector(selectors.header);
  const panel = container.querySelector(selectors.panel);

  return {
    container,
    header,
    panel,
  };
};

/**
 * Gets all of the individual accordion sections within an Accordion Component instance
 * @param {DocumentFragment} docFragment - DOM fragment to search
 * @returns {DocumentFragment[]} array of document fragments for each input
 */
const getAllSections = docFragment => {
  const component = getAccordion(docFragment, defaults.selectors);
  return component.sections;
};

/**
 * Tests to see if an accordion section is closed
 * @param {DocumentFragment} docFragment - document fragment to test
 * @param {object} wndw - window object
 */
const isClosed = (docFragment, wndw) => {
  const component = getAccordionSection(docFragment, defaults.selectors);
  /** @todo Jest doesn't seem to support testing live CSS styles from a class */
  // return parseFloat(utils.getCSSProperty(component.panel, 'height', wndw), 10) === 0;
  return !component.container.classList.contains(defaults.activeClass);
};

/**
 * Very basic test for a standard accordion. These ensure that the Feature "Accordion follows best practices"
 *   has tests for each scenario and it's `then`s
 * @type {object}
 * @property {scenario-test-object} header - test for section header
 */
const bestPractices = {
  header: {
    scenario: 'Accordion header behaves as a button',
    getActual: (docFragment = document, wndw = window) =>
      new Promise(resolve => {
        const component = getAccordionSection(docFragment, defaults.selectors);

        resolve({
          tagName: component.header.tagName.toLowerCase(),
        });
      }),
    comparison: actual => {
      // see ./accordion/requirements.feature file for Scenario "Accordion header behaves as a button"
      //  these tests conform to the `Then...` section
      expect(
        actual.tagName,
        'said section header behaves as a button'
      ).to.equal('button');
    },
  },
};

/**
 * Very basic test for a standard accordion. These ensure that the Feature "Opening an individual accordion section"
 *   has tests for each scenario and it's `then`s
 * @type {object}
 * @property {scenario-test-object} mouse - test for mouse user
 * @property {scenario-test-object} screenReader - test for screen reader user
 */
const openAccordion = {
  mouse: {
    scenario: 'Open an accordion panel as a mouse user',
    given: isClosed,
    getActual: (docFragment = document, wndw = window) =>
      new Promise(resolve => {
        const component = getAccordionSection(docFragment, defaults.selectors);
        component.header.click();

        // setTimeout(() => {
        //   resolve({
        //     /** @todo remove dummy value once CSS can be tested */
        //     panelHeight: utils.getCSSProperty(component.panel, 'height', wndw),
        //   });
        // }, defaults.animationTimeout);
        resolve({
          hasActiveClass: component.container.classList.contains(
            defaults.activeClass
          ),
        });
      }),
    comparison: actual => {
      // see ./accordion/requirements.feature file for Scenario "Open an accordion panel as a mouse user"
      //  these tests conform to the `Then...` section

      // expect(
      //   actual.panelHeight,
      //   "said section's panel will be opened"
      // ).to.be.above(0);
      expect(actual.hasActiveClass, "said section's panel will be opened").to.be
        .true;
    },
  },
  screenReader: {
    scenario: 'Open an accordion panel as a screen reader user',
    given: isClosed,
    getActual: (docFragment = document, wndw = window) =>
      new Promise(resolve => {
        const component = getAccordionSection(docFragment, defaults.selectors);
        component.header.click();

        resolve({
          hasActiveClass: component.container.classList.contains(
            defaults.activeClass
          ),
          ariaExpanded: component.header.getAttribute('aria-expanded'),
          ariaHidden: component.panel.getAttribute('aria-hidden'),
        });
      }),
    comparison: actual => {
      // see ./accordion/requirements.feature file for Scenario "Open an accordion panel as a screen reader user"
      //  these tests conform to the `Then...` section
      expect(actual.hasActiveClass, "said section's panel will be opened").to.be
        .true;
      expect(
        actual.ariaExpanded,
        'I am informed of the panels current visibility state'
      ).to.equal('true');
      /** @todo Carbon does not support this currently */
      // expect(actual.ariaHidden, 'contents of said panel are accessible').to.equal('false');
    },
  },
};

/**
 * Returns a set of test objects
 * @return {scenario-test-object[]} test objects for use in `testParser`
 */
export const accordionTests = () => {
  return [
    {
      feature: 'Accordion follows best practices', // matches the `Feature` name in requirements.feature
      set: getAllSections,
      tests: [bestPractices.header],
    },
    {
      feature: 'Expanding an individual accordion section', // matches the `Feature` name in requirements.feature
      set: getAllSections,
      beforeEach: (done, docFragment, wndw) => {
        const sections = getAllSections(docFragment);
        sections.forEach(section => {
          const component = getAccordionSection(section, defaults.selectors);
          if (component.container.classList.contains(defaults.activeClass)) {
            component.header.click();
          }
        });
        done();
      },
      tests: [openAccordion.mouse, openAccordion.screenReader],
    },
  ];
};
