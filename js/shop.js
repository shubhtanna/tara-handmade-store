function cardHTML(p) {
  var badge = p.stock === 0 ? '<span class="badge">Sold out</span>' : p.stock <= 3 ? '<span class="badge soft">Only ' + p.stock + ' left</span>' : '';
  return '<a class="card" href="product.html?p=' + p.slug + '">' +
    '<div class="card-img"><img src="' + IMG(p.img, 700) + '" alt="' + p.name + '" loading="lazy">' + badge + '</div>' +
    '<h3>' + p.name + '</h3>' +
    '<p class="card-mat">' + p.material + '</p>' +
    '<p class="card-price">' + formatINR(p.price) + '</p></a>';
}

(function () {
  var grid = document.getElementById('grid');
  if (!grid) return;
  var params = new URLSearchParams(location.search);
  var c = params.get('c') || '';
  var sortEl = document.getElementById('sort');
  sortEl.value = params.get('sort') || 'featured';

  document.querySelectorAll('#chips a').forEach(function (a) {
    if (a.dataset.c === c) a.classList.add('active');
  });
  if (COLLECTIONS[c]) {
    document.getElementById('shop-title').textContent = COLLECTIONS[c];
    document.title = COLLECTIONS[c] + ' | Tara Handmade';
  }

  function render() {
    var list = PRODUCTS.filter(function (p) { return !c || p.collection === c; });
    if (sortEl.value === 'low') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (sortEl.value === 'high') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    grid.innerHTML = list.map(cardHTML).join('');
    document.getElementById('count').textContent = list.length + ' pieces';
  }

  sortEl.addEventListener('change', function () {
    params.set('sort', sortEl.value);
    history.replaceState(null, '', '?' + params.toString());
    render();
  });
  render();
})();
