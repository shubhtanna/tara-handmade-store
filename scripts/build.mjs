// Build script for Tara Handmade.
// Reads the catalogue from js/products.js (the store's own data source) and
// generates, at build time:
//   - /products/<slug>/index.html   one plain-HTML page per product (+ Product JSON-LD)
//   - /buy/<slug>/index.html        a no-JavaScript cart holding that one product
//   - /checkout/<slug>/index.html   a shareable checkout page with the order in the HTML
//   - /sitemap.xml and /llms.txt
// It also injects a plain-HTML product list into index.html and shop.html.
// No dependencies. Run: node scripts/build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, content) => {
  const file = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('wrote', p);
};

// --- Load the catalogue -------------------------------------------------------
const { PRODUCTS, COLLECTIONS, IMG, formatINR } = new Function(
  read('js/products.js') + '\nreturn { PRODUCTS, COLLECTIONS, IMG, formatINR };'
)();

// --- Shared markup, taken from the existing pages ------------------------------
const home = read('index.html');
const header = home.match(/<div class="topbar">[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];

// Header/footer were written for pages at the site root; make their links root-relative
// so they also work from /products/<slug>/ and friends.
const rootify = (html) => html.replace(/(href|src)="(?!https?:|\/|#|mailto:)([^"]*)"/g, '$1="/$2"');
const HEADER = rootify(header);
const FOOTER = rootify(footer);

const head = (title, description, extra = '') => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/images/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
${extra}</head>
`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const productUrl = (p) => `/products/${p.slug}/`;
const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= 1999 ? 0 : 79);

function badge(p) {
  if (p.stock === 0) return '<span class="badge">Sold out</span>';
  if (p.stock <= 3) return `<span class="badge soft">Only ${p.stock} left</span>`;
  return '';
}

function stockLine(p) {
  if (p.stock === 0) return '<p class="stock out">Sold out. New batch in about 2 weeks.</p>';
  if (p.stock <= 3) return `<p class="stock low">Only ${p.stock} left in this batch</p>`;
  return '<p class="stock">In stock · ships in 2 days</p>';
}

function cardHTML(p) {
  return `<a class="card" href="${productUrl(p)}">
        <div class="card-img"><img src="${IMG(p.img, 700)}" alt="${esc(p.name)}" loading="lazy">${badge(p)}</div>
        <h3>${esc(p.name)}</h3>
        <p class="card-mat">${esc(p.material)}</p>
        <p class="card-price">${formatINR(p.price)}</p>
      </a>`;
}

// --- Product pages -------------------------------------------------------------
for (const p of PRODUCTS) {
  const inStock = p.stock > 0;
  const buy = inStock
    ? `<div class="buy-row"><a class="btn" href="/buy/${p.slug}/">Add to cart</a></div>`
    : '<div class="buy-row"><span class="btn" aria-disabled="true">Sold out</span></div>';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    image: IMG(p.img, 1400),
    sku: p.id,
    url: productUrl(p),
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'INR',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: productUrl(p)
    }
  };
  write(`products/${p.slug}/index.html`, `${head(`${p.name} | Tara Handmade`, p.desc,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n`)}
<body class="product">
${HEADER}
<main>

<section class="section">
  <div class="pdp">
    <div class="pdp-img"><img src="${IMG(p.img, 1400)}" alt="${esc(p.name)}"></div>
    <div class="pdp-info">
      <p class="crumbs"><a href="/shop.html">Shop</a> / <a href="/shop.html?c=${p.collection}">${COLLECTIONS[p.collection]}</a></p>
      <h1>${esc(p.name)}</h1>
      <p class="pdp-price">${formatINR(p.price)}</p>
      <p class="muted small">Inclusive of all taxes</p>
      <p class="pdp-desc">${esc(p.desc)}</p>
      ${stockLine(p)}
      ${buy}
      <dl class="specs"><dt>Material</dt><dd>${esc(p.material)}</dd><dt>Details</dt><dd>${esc(p.note)}</dd><dt>Code</dt><dd>${p.id}</dd></dl>
      <details><summary>Shipping &amp; returns</summary><p>Free shipping over ₹1,999. 7-day returns on unworn pieces (except earrings).</p></details>
      <details><summary>Care</summary><p>Keep away from water and perfume. Store in the cotton pouch provided.</p></details>
    </div>
  </div>
</section>

</main>
${FOOTER}
<script src="/js/products.js"></script>
<script src="/js/cart.js"></script>
</body>
</html>
`);
}

// --- /buy/<slug>/ : a cart page holding that one product ------------------------
for (const p of PRODUCTS) {
  const shipping = shippingFor(p.price);
  write(`buy/${p.slug}/index.html`, `${head(`Your cart | Tara Handmade`, 'Your shopping bag.')}
<body class="cart">
${HEADER}
<main>

<section class="section narrow">
  <h1>Your cart</h1>
  <div id="cart">
    <ul class="bag">
      <li>
        <img src="${IMG(p.img, 300)}" alt="">
        <div class="bag-info"><a href="${productUrl(p)}">${esc(p.name)}</a>
          <div class="qty small-qty"><span>1</span></div>
        </div>
        <div class="bag-right"><b>${formatINR(p.price)}</b></div>
      </li>
    </ul>
    <div class="bag-total">
      <p><span>Subtotal</span><span>${formatINR(p.price)}</span></p>
      <p><span>Shipping</span><span>${shipping ? formatINR(shipping) : 'Free'}</span></p>
      <p class="grand"><span>Total</span><span>${formatINR(p.price + shipping)}</span></p>
      <a href="/checkout/${p.slug}/" class="btn wide">Checkout</a>
    </div>
  </div>
</section>

</main>
${FOOTER}
<script src="/js/products.js"></script>
<script src="/js/cart.js"></script>
</body>
</html>
`);
}

// --- /checkout/<slug>/ : shareable checkout page with the order in the HTML -----
const checkoutTemplate = read('checkout.html').replace(
  /(href|src)="(?!https?:|\/|#|mailto:)([^"]*)"/g,
  '$1="/$2"'
);
for (const p of PRODUCTS) {
  const shipping = shippingFor(p.price);
  const summary = `<h3>Your order</h3>
      <div class="sum-line"><img src="${IMG(p.img, 200)}" alt=""><span>${esc(p.name)}<small>Qty 1</small></span><b>${formatINR(p.price)}</b></div>
      <p><span>Shipping</span><span>${shipping ? formatINR(shipping) : 'Free'}</span></p>
      <p class="grand"><span>Total</span><span>${formatINR(p.price + shipping)}</span></p>`;
  const page = checkoutTemplate.replace(
    '<aside class="summary" id="summary"></aside>',
    `<aside class="summary" id="summary" data-items="${p.slug}:1">${summary}</aside>`
  );
  write(`checkout/${p.slug}/index.html`, page);
}

// --- Plain-HTML product lists on the homepage and shop page ---------------------
// Homepage keeps its curated "Loved right now" grid (same four pieces as before),
// now linking to the generated product pages; the shop page lists everything.
const FEATURED = ['chand-crescent-pendant', 'paperclip-chain-bracelet', 'twist-huggie-hoops', 'moti-pearl-strand'];
const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
const lists = {
  'index.html': FEATURED.map((s) => cardHTML(bySlug[s])).join('\n      '),
  'shop.html': PRODUCTS.map(cardHTML).join('\n      ')
};
for (const [file, html] of Object.entries(lists)) {
  const current = read(file);
  if (!current.includes('<!-- PRODUCTS:START -->')) continue;
  write(file, current.replace(
    /<!-- PRODUCTS:START -->[\s\S]*?<!-- PRODUCTS:END -->/,
    `<!-- PRODUCTS:START -->\n      ${html}\n      <!-- PRODUCTS:END -->`
  ));
}

// --- sitemap.xml ----------------------------------------------------------------
const urls = ['/', '/shop.html', ...PRODUCTS.map(productUrl)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);

// --- llms.txt --------------------------------------------------------------------
write('llms.txt', `# Tara Handmade

Handmade demi-fine jewellery (earrings, necklaces, bracelets and rings) from a small studio in Jaipur, India. Prices in INR, inclusive of GST.

## Products

${PRODUCTS.map((p) => `- [${p.name}](${productUrl(p)}): ${formatINR(p.price)}`).join('\n')}

## How to buy

1. Open a product page (links above) and use its "Add to cart" link to open a cart with that item.
2. On the cart page, follow the "Checkout" link. It opens a checkout page that shows the same order on any device, no cookies or sign-in needed.
3. Fill in the name, WhatsApp number, email and shipping address, then submit the order request. The studio confirms every order personally on WhatsApp with a UPI payment link.
`);

console.log('done');
