# Tara Handmade

Website for Tara Handmade, a small demi-fine jewellery studio in Jaipur.

> This is a demo store. No real orders, payments or deliveries are processed.

Plain HTML, CSS and JavaScript. No build step, no framework.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Files

| File | What it does |
|---|---|
| `index.html` | Home page |
| `shop.html` | All products, filter by collection (`?c=earrings`) and sort |
| `product.html` | Product page, loaded by slug (`?p=chand-crescent-pendant`) |
| `cart.html`, `checkout.html`, `thank-you.html` | Bag and order request |
| `js/products.js` | Product list: edit this to add or change products |
| `js/cart.js` | Bag stored in the browser (`localStorage`) |

Orders are confirmed by the studio on WhatsApp, with a UPI link for payment (not connected in this demo).

Hosted on Vercel. Photos from [Unsplash](https://unsplash.com).
