(function () {
  // Shareable links: /checkout/<slug>/ pages carry their item in the HTML
  // (data-items on the summary), and checkout.html accepts ?items=<slug>:<qty>,…
  var params = new URLSearchParams(location.search);
  var itemsParam = params.get('items');
  var summaryEl = document.getElementById('summary');
  var preset = summaryEl.dataset.items;
  if (itemsParam) {
    saveCart(itemsParam.split(',').map(function (pair) {
      var bits = pair.split(':');
      return { key: bits[0] + '|', slug: bits[0], variant: '', qty: Math.min(5, Math.max(1, Number(bits[1]) || 1)) };
    }).filter(function (i) { return findProduct(i.slug); }));
  } else if (preset && !getCart().length) {
    saveCart([{ key: preset.split(':')[0] + '|', slug: preset.split(':')[0], variant: '', qty: 1 }]);
  }

  var t = cartTotals();
  if (!t.lines.length) { location.href = '/cart.html'; return; }

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
    location.href = '/thank-you.html?order=' + id;
  });
})();
