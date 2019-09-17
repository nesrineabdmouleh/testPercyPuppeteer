// Using chai
const {expect} = require('chai');
const { percySnapshot } = require('@percy/puppeteer');

// Importing pages
const HomePage = require('../../pages/FO/home');

let page;
let homePage;
let allProductsNumber = 0;

// creating pages objects in a function
const init = async () => {
  page = await global.browser.newPage();
  homePage = await (new HomePage(page));
};

/*
  Open the FO home pages
  Get the product number
  Filter products by a category
  Filter products by a subcategory
 */
global.scenario('Filter Products by categories in Home pages', () => {
  test('should open the shop pages', async () => {
    await homePage.goTo(global.URL_FO);
    await percySnapshot(page, 'Home');
    await homePage.checkHomePage();
  });
  test('should check and get the products number', async () => {
    await homePage.waitForSelectorAndClick(homePage.allProductLink);
    await percySnapshot(page, 'All product page');
    allProductsNumber = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(allProductsNumber).to.be.above(0);
  });
  test('should filter products by the category "Accessories" and check result', async () => {
    await homePage.filterByCategory('6');
    await percySnapshot(page, 'Filter by category');
    const numberOfProducts = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });
  test('should filter products by the subcategory "Stationery" and check result', async () => {
    await homePage.filterSubCategory('6', '7');
    await percySnapshot(page, 'Filter by subcategory');
    const numberOfProducts = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });
}, init, true);
