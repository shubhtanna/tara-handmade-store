(function () {
  var slug = new URLSearchParams(location.search).get('p');
  var p = findProduct(slug);
  var box = document.getElementById('product');

  if (!p) {
    box.innerHTML = '<div class="center"><h1>We couldn\'t find that piece</h1><p class="muted">It may have sold out.</p><a class="btn" href="shop.html">Back to shop</a></div>';
    document.getElementById('related').parentElement.style.display = 'none';
    return;
  }

  document.title = p.name + ' | Tara Handmade';

  var options = '';
  if (p.options) {
    options += '<p class="opt-label">Stone</p><div class="opts" data-group="stone">' +
      p.options.map(function (o, i) { return '<button type="button" class="opt' + (i === 0 ? ' active' : '') + '" data-value="' + o + '">' + o + '</button>'; }).join('') + '</div>';
  }
  if (p.sizes) {
    options += '<p class="opt-label">Ring size <a href="care.html#care" class="tiny">How to measure</a></p><div class="opts" data-group="size">' +
      p.sizes.map(function (s) { return '<button type="button" class="opt" data-value="' + s + '">' + s + '</button>'; }).join('') + '</div>';
  }

  var stockLine = p.stock === 0 ? '<p class="stock out">Sold out. New batch in about 2 weeks.</p>'
    : p.stock <= 3 ? '<p class="stock low">Only ' + p.stock + ' left in this batch</p>'
    : '<p class="stock">In stock · ships in 2 days</p>';

  box.innerHTML =
    '<div class="pdp">' +
      '<div class="pdp-img"><img src="' + IMG(p.img, 1400) + '" alt="' + p.name + '"></div>' +
      '<div class="pdp-info">' +
        '<p class="crumbs"><a href="shop.html">Shop</a> / <a href="shop.html?c=' + p.collection + '">' + COLLECTIONS[p.collection] + '</a></p>' +
        '<h1>' + p.name + '</h1>' +
        '<p class="pdp-price">' + formatINR(p.price) + '</p>' +
        '<p class="muted small">Inclusive of all taxes</p>' +
        '<p class="pdp-desc">' + p.desc + '</p>' +
        options +
        stockLine +
        '<div class="buy-row">' +
          '<div class="qty"><button type="button" data-q="-1">−</button><span id="qty">1</span><button type="button" data-q="1">+</button></div>' +
          '<button class="btn" id="add"' + (p.stock === 0 ? ' disabled' : '') + '>' + (p.stock === 0 ? 'Sold out' : 'Add to bag') + '</button>' +
        '</div>' +
        '<p class="error" id="opt-error"></p>' +
        '<dl class="specs"><dt>Material</dt><dd>' + p.material + '</dd><dt>Details</dt><dd>' + p.note + '</dd><dt>Code</dt><dd>' + p.id + '</dd></dl>' +
        '<details><summary>Shipping &amp; returns</summary><p>Free shipping over ₹1,999. 7-day returns on unworn pieces (except earrings).</p></details>' +
        '<details><summary>Care</summary><p>Keep away from water and perfume. Store in the cotton pouch provided.</p></details>' +
      '</div>' +
    '</div>';

  var qty = 1;
  box.querySelectorAll('[data-q]').forEach(function (b) {
    b.addEventListener('click', function () {
      qty = Math.max(1, Math.min(Math.min(5, p.stock || 1), qty + Number(b.dataset.q)));
      document.getElementById('qty').textContent = qty;
    });
  });
  box.querySelectorAll('.opts').forEach(function (group) {
    group.addEventListener('click', function (e) {
      if (!e.target.classList.contains('opt')) return;
      group.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('active'); });
      e.target.classList.add('active');
    });
  });

  var add = document.getElementById('add');
  add.addEventListener('click', function () {
    var parts = [];
    var err = document.getElementById('opt-error');
    err.textContent = '';
    var stone = box.querySelector('[data-group="stone"] .active');
    if (stone) parts.push(stone.dataset.value);
    if (p.sizes) {
      var size = box.querySelector('[data-group="size"] .active');
      if (!size) { err.textContent = 'Please choose a ring size.'; return; }
      parts.push('Size ' + size.dataset.value);
    }
    addToCart(p.slug, parts.join(' · '), qty);
    toast('Added to your bag · <a href="cart.html">View bag</a>');
  });

  var related = PRODUCTS.filter(function (x) { return x.collection === p.collection && x.slug !== p.slug; }).slice(0, 4);
  document.getElementById('related').innerHTML = related.map(function (r) {
    return '<a class="card" href="product.html?p=' + r.slug + '"><div class="card-img"><img src="' + IMG(r.img, 700) + '" alt="' + r.name + '" loading="lazy"></div><h3>' + r.name + '</h3><p class="card-price">' + formatINR(r.price) + '</p></a>';
  }).join('');
})();
