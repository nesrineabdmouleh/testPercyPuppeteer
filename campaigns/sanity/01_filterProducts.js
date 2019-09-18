// Using chai
const {expect} = require('chai');
const helper = require('../utils/helpers');
const { percySnapshot } = require('@percy/puppeteer');

// Importing pages
const HomePage = require('../../pages/FO/home');

let browser;
let page;
let homePage;
let allProductsNumber = 0;

// creating pages objects in a function
const init = async () => {
  homePage = await (new HomePage(page));
};

/*
  Open the FO home pages
  Get the product number
  Filter products by a category
  Filter products by a subcategory
 */
describe('Filter Products by categories in Home pages', () => {
  before(async () => {
    browser = await helper.createBrowser();
    page = await browser.newPage();
    await init();
  });
  after(async () => {
    await browser.close();
  });
  // Steps
  it('should open the shop pages', async () => {
    await homePage.goTo(global.URL_FO);
    await percySnapshot(page, 'Home');
    await homePage.checkHomePage();
  });
  it('should check and get the products number', async () => {
    await homePage.goTo(global.URL_FO + '/en/2-accueil');
    await percySnapshot(page, 'All product page');
    allProductsNumber = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(allProductsNumber).to.be.above(0);
  });
  it('should filter products by the category "Accessories" and check result', async () => {
    await homePage.filterByCategory('6');
    await percySnapshot(page, 'Filter by category');
    const numberOfProducts = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });
  it('should filter products by the subcategory "Homme" and check result', async () => {
    await homePage.filterSubCategory('3', '4');
    await percySnapshot(page, 'Filter by subcategory');
    const numberOfProducts = await homePage.getNumberFromText(homePage.totalProducts);
    await expect(numberOfProducts).to.be.below(allProductsNumber);
  });
});
