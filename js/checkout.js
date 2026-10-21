(function () {
  // Accept a shareable link like checkout.html?items=moti-pearl-strand:1,twist-huggie-hoops:2
  // and fill the cart from it in the browser.
  var itemsParam = new URLSearchParams(location.search).get('items');
  if (itemsParam) {
    itemsParam.split(',').forEach(function (part) {
      var bits = part.split(':');
      var p = findProduct(bits[0].trim());
      if (!p) return;
      var qty = Math.max(1, Math.min(5, parseInt(bits[1], 10) || 1));
      addToCart(p.slug, '', qty);
    });
    history.replaceState(null, '', 'checkout.html');
  }

  var t = cartTotals();
  if (!t.lines.length) { location.href = 'cart.html'; return; }

  document.getElementById('summary').innerHTML =
    '<h3>Your order</h3>' +
    t.lines.map(function (l) {
      return '<div class="sum-line"><img src="' + IMG(l.product.img, 200) + '" alt=""><span>' + l.product.name +
        (l.item.variant ? '<small>' + l.item.variant + '</small>' : '') + '<small>Qty ' + l.item.qty + '</small></span><b>' + formatINR(l.total) + '</b></div>';
    }).join('') +
    '<p><span>Shipping</span><span>' + (t.shipping ? formatINR(t.shipping) : 'Free') + '</span></p>' +
    '<p class="grand"><span>Total</span><span>' + formatINR(t.total) + '</span></p>';

  var form = document.getElementById('checkout-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = Object.fromEntries(new FormData(form).entries());
    var err = '';
    var phone = (d.phone || '').replace(/\D/g, '').slice(-10);
    if (!d.name || d.name.trim().length < 2) err = 'Please enter your name.';
    else if (!/^[6-9]\d{9}$/.test(phone)) err = 'Please enter a valid 10-digit WhatsApp number.';
    else if (!/^\S+@\S+\.\S+$/.test(d.email || '')) err = 'Please enter a valid email.';
    else if (!d.address || d.address.trim().length < 8) err = 'Please enter your full address.';
    else if (!d.city || !d.state) err = 'Please enter your city and state.';
    else if (!/^\d{6}$/.test(d.pincode || '')) err = 'Please enter a 6-digit PIN code.';
    document.getElementById('form-error').textContent = err;
    if (err) return;

    var id = 'TH' + Date.now().toString().slice(-6);
    localStorage.setItem('tara_last_order', JSON.stringify({ id: id, items: t.count, total: t.total, gift: !!d.gift }));
    saveCart([]);
    location.href = 'thank-you.html?order=' + id;
  });
})();
