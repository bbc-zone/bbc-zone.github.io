# Lumbung Nusantara React Static Site

React/Vite version of the Lumbung Nusantara pages. Product, store, FAQ, and promotion content is stored in local JavaScript files; this app does not call WordPress, PHP, REST endpoints, or a database.

## Pages

- Home: `src/pages/HomePage.jsx`
- Catalog and product detail: `src/pages/CatalogPage.jsx`, `src/pages/ProductPage.jsx`
- Cart and WhatsApp checkout: `src/pages/CartPage.jsx`, `src/pages/CheckoutPage.jsx`
- About, contact, FAQ, privacy, and terms each have a separate file in `src/pages/`

## Logic and local data

- Store and product data: `src/data/`
- Product search/filter: `src/services/CatalogService.js`
- Browser cart: `src/services/CartService.js` (`localStorage` only)
- WhatsApp message formatting: `src/services/CheckoutService.js`
- Static store data access: `src/services/StoreService.js`

Cart values are stored on the visitor's device. Checkout opens WhatsApp with a prefilled message; it does not create a server order or process payment. Prices, shipping estimates, and stock are static and need manual updates in `src/data/`.

## Run and build

```sh
npm install
npm run dev
npm run build
```

The production build is written to `dist/`. The included Apache `.htaccess` serves the build at `/ln/reactlp/`; source images are also kept under `assets/images/` and `public/assets/images/` so all site assets remain inside this folder.
