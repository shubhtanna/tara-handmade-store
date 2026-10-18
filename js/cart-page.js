(function () {
  var box = document.getElementById('cart');

  function render() {
    var t = cartTotals();
    if (!t.lines.length) {
      box.innerHTML = '<div class="empty"><p>Your bag is empty.</p><a href="shop.html" class="btn">Find something you love</a></div>';
      return;
    }
    box.innerHTML =
      '<ul class="bag">' + t.lines.map(function (l) {
        return '<li>' +
          '<img src="' + IMG(l.product.img, 300) + '" alt="">' +
          '<div class="bag-info"><a href="product.html?p=' + l.product.slug + '">' + l.product.name + '</a>' +
            (l.item.variant ? '<span class="muted small">' + l.item.variant + '</span>' : '') +
            '<div class="qty small-qty"><button data-k="' + l.item.key + '" data-d="-1">−</button><span>' + l.item.qty + '</span><button data-k="' + l.item.key + '" data-d="1">+</button></div>' +
          '</div>' +
          '<div class="bag-right"><b>' + formatINR(l.total) + '</b><button class="link" data-remove="' + l.item.key + '">Remove</button></div>' +
        '</li>';
      }).join('') + '</ul>' +
      '<div class="bag-total">' +
        '<p><span>Subtotal</span><span>' + formatINR(t.subtotal) + '</span></p>' +
        '<p><span>Shipping</span><span>' + (t.shipping ? formatINR(t.shipping) : 'Free') + '</span></p>' +
        (t.subtotal < FREE_SHIPPING ? '<p class="muted small">Add ' + formatINR(FREE_SHIPPING - t.subtotal) + ' more for free shipping</p>' : '') +
        '<p class="grand"><span>Total</span><span>' + formatINR(t.total) + '</span></p>' +
        '<a href="checkout.html" class="btn wide">Checkout</a>' +
      '</div>';
  }

  box.addEventListener('click', function (e) {
    var b = e.target;
    if (b.dataset.remove) { setQty(b.dataset.remove, 0); render(); }
    if (b.dataset.k) {
      var item = getCart().filter(function (i) { return i.key === b.dataset.k; })[0];
      if (item) { setQty(item.key, Math.min(5, item.qty + Number(b.dataset.d))); render(); }
    }
  });

  render();
})();
