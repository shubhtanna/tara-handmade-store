// Cart kept in localStorage. Shared by every page.
var CART_KEY = 'tara_cart';
var FREE_SHIPPING = 1999;
var SHIPPING = 79;

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function addToCart(slug, variant, qty) {
  var items = getCart();
  var key = slug + '|' + (variant || '');
  var found = items.filter(function (i) { return i.key === key; })[0];
  if (found) found.qty = Math.min(5, found.qty + qty);
  else items.push({ key: key, slug: slug, variant: variant || '', qty: qty });
  saveCart(items);
}

function setQty(key, qty) {
  var items = getCart().map(function (i) { if (i.key === key) i.qty = qty; return i; })
    .filter(function (i) { return i.qty > 0; });
  saveCart(items);
}

function cartTotals() {
  var lines = getCart().map(function (i) {
    var p = findProduct(i.slug);
    return p ? { item: i, product: p, total: p.price * i.qty } : null;
  }).filter(Boolean);
  var subtotal = lines.reduce(function (s, l) { return s + l.total; }, 0);
  var shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  return { lines: lines, subtotal: subtotal, shipping: shipping, total: subtotal + shipping,
    count: lines.reduce(function (s, l) { return s + l.item.qty; }, 0) };
}

function updateCartCount() {
  var n = cartTotals().count;
  document.querySelectorAll('.cart-count').forEach(function (el) {
    el.textContent = n;
    el.style.display = n ? 'inline-flex' : 'none';
  });
}

function toast(msg) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.classList.add('show'); }, 10);
  setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2600);
}

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
});
