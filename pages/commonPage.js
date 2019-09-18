// Using chai
const {expect} = require('chai');

module.exports = class CommonPage {
  constructor(page) {
    this.page = page;
  }

  async getPageTitle() {
    return this.page.title();
  }

  async goTo(URL) {
    await this.page.goto(URL);
  }

  /**
   * Get Text from element
   * @param selector, from where to get text
   * @return textContent
   */
  async getTextContent(selector) {
    return this.page.$eval(selector, el => el.textContent);
  }

  /**
   * Is checkBox have checked status
   * @param selector, checkbox to check
   * @return boolean, true if checked, false if not
   */
  async elementChecked(selector) {
    return this.page.$eval(selector, el => el.checked);
  }

  /**
   * Is element visible
   * @param selector, element to check
   * @return boolean, true if visible, false if not
   */
  async elementVisible(selector, timeout = 10) {
    try {
      await this.page.waitForSelector(selector, {visible: true, timeout});
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for selector and click
   * @param selector, element to check
   * @param timeout, wait timeout
   * @return {Promise<void>}
   */
  async waitForSelectorAndClick(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, {visible: true, timeout});
    await this.page.click(selector);
  }

  /**
   * Check text value
   * @param selector, element to check
   * @param textToCheckWith, text to check with
   * @param parameter, parameter to use
   * @return promise, throw an error if element does not exist or text is not correct
   */
  async checkTextValue(selector, textToCheckWith, parameter = 'equal') {
    await this.page.waitForSelector(selector);
    switch (parameter) {
      case 'equal':
        await this.page.$eval(selector, el => el.innerText)
          .then(text => expect(text.replace(/\s+/g, ' ').trim()).to.equal(textToCheckWith));
        break;
      case 'contain':
        await this.page.$eval(selector, el => el.innerText)
          .then(text => expect(text).to.contain(textToCheckWith));
        break;
      default:
      // do nothing
    }
  }

  /**
   * Check attribute value
   * @param selector, element to check
   * @param attribute, attribute to test
   * @param textToCheckWith, text to check with
   * @return promise, throw an error if element does not exist or attribute value is not correct
   */
  async checkAttributeValue(selector, attribute, textToCheckWith) {
    await this.page.waitForSelector(selector);
    const value = await this.page.$eval(selector, (el, attr) => el
      .getAttribute(attr), attribute);
    expect(value).to.be.equal(textToCheckWith);
  }

  /**
   * Delete the existing text from input then set a value
   * @param selector, input
   * @param value, value to set in the input
   * @return {Promise<void>}
   */
  async setValue(selector, value) {
    await this.waitForSelectorAndClick(selector);
    await this.page.click(selector, {clickCount: 3});
    await this.page.type(selector, value);
  }

  /**
   * To get a number from text
   * @param selector
   * @param timeout
   * @return integer
   */
  async getNumberFromText(selector, timeout = 0) {
    await this.page.waitFor(timeout);
    const text = await this.getTextContent(selector);
    const number = /\d+/g.exec(text).toString();
    return parseInt(number, 10);
  }
};
