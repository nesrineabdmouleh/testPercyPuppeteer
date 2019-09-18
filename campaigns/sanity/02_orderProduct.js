// Using chai
const {expect} = require('chai');
const helper = require('../utils/helpers');

// Importing pages
const HomePage = require('../../pages/FO/home');
const CartPage = require('../../pages/FO/cart');
const LoginPage = require('../../pages/FO/login');
const CheckoutPage = require('../../pages/FO/checkout');
const OrderConfirmationPage = require('../../pages/FO/orderConfirmation');
const customer = require('../data/FO/customer');
const CartData = require('../data/FO/cart');
const { percySnapshot } = require('@percy/puppeteer');

let browser;
let page;
let homePage;
let cartPage;
let loginPage;
let checkoutPage;
let orderConfirmationPage;

// creating pages objects in a function
const init = async () => {
  homePage = await (new HomePage(page));
  cartPage = await (new CartPage(page));
  loginPage = await (new LoginPage(page));
  checkoutPage = await (new CheckoutPage(page));
  orderConfirmationPage = await (new OrderConfirmationPage(page));
};

/*
  Order a product and check order confirmation
 */
describe('Order a product and check order confirmation', () => {
  before(async () => {
    browser = await helper.createBrowser();
    page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-GB',
    });
    await init();
  });
  after(async () => {
    await browser.close();
  });
  // Steps
  it('should open the shop page', async () => {
    await homePage.goTo(global.URL_FO);
    await homePage.checkHomePage();
  });
  it('should go to login page', async () => {
    await homePage.goToLoginPage();
    await percySnapshot(page, 'Login page');
    const pageTitle = await loginPage.getPageTitle();
    await expect(pageTitle).to.equal(loginPage.pageTitle);
  });
  it('should sign In in FO With default account', async () => {
    await loginPage.customerLogin(customer.defaultAccount);
    await percySnapshot(page, 'Customer login');
    const connected = await homePage.isCustomerConnected();
    await expect(connected, 'Customer is not connected in FO').to.be.true;
  });
  it('should go to home page', async () => {
    await homePage.goTo(global.URL_FO);
    await percySnapshot(page, 'Home page');
    await homePage.checkHomePage();
  });
  it('should add first product to cart and Proceed to checkout', async () => {
    await homePage.addProductToCartByQuickView('1', '1');
    await percySnapshot(page, 'Quick View');
    await homePage.proceedToCheckout();
    await percySnapshot(page, 'Proceed to checkout');
    const pageTitle = await cartPage.getPageTitle();
    await expect(pageTitle).to.equal(cartPage.pageTitle);
  });
  it('should check the cart details', async () => {
    await cartPage.checkProductInCart(CartData.customCartData.firstProduct, '1');
    await percySnapshot(page, 'Cart details');
  });
  it('should proceed to checkout and check Step Address', async () => {
    await cartPage.clickOnProceedToCheckout();
    await percySnapshot(page, 'Proceed to checkout');
    const isCheckoutPage = await checkoutPage.isCheckoutPage();
    await expect(isCheckoutPage, 'Browser is not in checkout Page').to.be.true;
    const isStepPIComplete = await checkoutPage.isStepCompleted(checkoutPage.personalInformationStepSection);
    await expect(isStepPIComplete, 'Step Personal information is not complete').to.be.true;
  });
  it('should validate Step Address and go to Delivery Step', async () => {
    const isStepAddressComplete = await checkoutPage.goToDeliveryStep();
    await expect(isStepAddressComplete, 'Step Address is not complete').to.be.true;
  });
  it('should validate Step Delivery and go to Payment Step', async () => {
    const isStepDeliveryComplete = await checkoutPage.goToPaymentStep();
    await expect(isStepDeliveryComplete, 'Step Address is not complete').to.be.true;
  });
  it('should Pay by back wire and confirm order', async () => {
    await checkoutPage.choosePaymentAndOrder('ps_wirepayment');
    await percySnapshot(page, 'Payment Order');
    const pageTitle = await orderConfirmationPage.getPageTitle();
    await expect(pageTitle).to.equal(orderConfirmationPage.pageTitle);
    const cardTitle = await orderConfirmationPage.getTextContent(orderConfirmationPage.orderConfirmationCardTitleH3);
    await expect(cardTitle).to.contains(orderConfirmationPage.orderConfirmationCardTitle);
  });
});
