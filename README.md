# testPercyPuppeteer
## How to install your environment

```bash
git clone https://github.com/nesrineabdmouleh/testPercyPuppeteer.git
npm i
```

### Available command line parameters

| Parameter           | Description      |
|---------------------|----------------- |
| URL_BO              | URL of your PrestaShop website Back Office (default to **http://localhost:8080/admin-dev/**) |
| URL_FO              | URL of your PrestaShop website Front Office (default to **http://localhost:8080/**) |
| LOGIN               | LOGIN of your PrestaShop website (default to **demo@prestashop.com**) |
| PASSWD              | PASSWD of your PrestaShop website (default to **prestashop_demo**) |

#### With default values

```bash
npm run sanity-tests
```