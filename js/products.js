// Tara Handmade catalogue. Prices in INR, inclusive of GST.
var IMG = function (id, w) {
  return 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 800) + '&q=75&auto=format&fit=crop';
};

var COLLECTIONS = {
  earrings: 'Earrings',
  necklaces: 'Necklaces',
  bracelets: 'Bracelets',
  rings: 'Rings'
};

var PRODUCTS = [
  { id: 'TH-E01', slug: 'twist-huggie-hoops', name: 'Twist Huggie Hoops', collection: 'earrings', price: 1490, img: '1617038220319-276d3cfab638',
    material: '18k gold-plated brass', note: 'Lightweight · hypoallergenic posts',
    desc: 'Small twisted hoops that hug the earlobe. Easy to sleep in, easy to stack with studs.', stock: 9 },
  { id: 'TH-E02', slug: 'neelam-statement-earrings', name: 'Neelam Statement Earrings', collection: 'earrings', price: 3290, img: '1535632066927-ab7c9ab60908',
    material: '925 sterling silver, blue topaz-tone crystals', note: 'Handset stones',
    desc: 'Vintage-inspired drops with a deep blue centre stone framed by baguette crystals. Made for weddings and big nights out.', stock: 3 },
  { id: 'TH-E03', slug: 'heart-drop-earrings', name: 'Blue Heart Drops', collection: 'earrings', price: 1290, img: '1630019852942-f89202989a59',
    material: '18k gold-plated sterling hooks, glass hearts', note: 'Gift favourite',
    desc: 'Faceted cobalt-blue hearts on fine gold hooks. A little playful, very wearable.', stock: 12 },
  { id: 'TH-E04', slug: 'phool-flower-studs', name: 'Phool Flower Studs', collection: 'earrings', price: 1890, img: '1626784215021-2e39ccf971cd',
    material: 'Gold-plated brass, cubic zirconia', note: 'Push-back closure',
    desc: 'A ring of tiny petals around a single sparkling centre, inspired by the marigold.', stock: 0 },

  { id: 'TH-N01', slug: 'chand-crescent-pendant', name: 'Chand Crescent Pendant', collection: 'necklaces', price: 2490, img: '1599643478518-a784e5dc4c8f',
    material: '18k gold-plated sterling silver', note: 'Chain 45 cm with 5 cm extender',
    desc: 'A fine moon pendant dotted with tiny stones. Our most-gifted piece.', stock: 14 },
  { id: 'TH-N02', slug: 'moti-pearl-strand', name: 'Moti Pearl Strand', collection: 'necklaces', price: 5890, img: '1515562141207-7a88fb7ce338',
    material: 'Freshwater pearls, silver clasp', note: 'Hand-knotted on silk',
    desc: 'Classic freshwater pearls, hand-knotted one by one on silk thread so they never rub together.', stock: 4 },
  { id: 'TH-N03', slug: 'single-pearl-drop', name: 'Single Pearl Drop Necklace', collection: 'necklaces', price: 1990, img: '1611085583191-a3b181a88401',
    material: '18k gold-plated sterling, freshwater pearl', note: 'Chain 42 cm',
    desc: 'One small, glowing pearl on a barely-there chain. Everyday elegance.', stock: 18 },
  { id: 'TH-N04', slug: 'temple-lakshmi-haar', name: 'Temple Lakshmi Haar', collection: 'necklaces', price: 6490, img: '1601121141461-9d6647bca1ed',
    material: 'Gold-plated brass, kemp stones', note: 'Made in Nagercoil · ships in 10 days',
    desc: 'A traditional temple-jewellery necklace with Lakshmi motifs and ruby-red kemp stones, made by a third-generation craftsman in Nagercoil.', stock: 2 },
  { id: 'TH-N05', slug: 'layered-solitaire-necklace', name: 'Layered Solitaire Necklace', collection: 'necklaces', price: 2290, img: '1610694955371-d4a3e0ce4b52',
    material: 'Rose gold-plated sterling, CZ', note: 'Two layers, one clasp',
    desc: 'A tiny solitaire and a bar charm on two fine chains, pre-layered so they never tangle.', stock: 7 },
  { id: 'TH-N06', slug: 'sikka-coin-chains', name: 'Sikka Coin Layered Chains', collection: 'necklaces', price: 2990, img: '1635767798638-3e25273a8236',
    material: '18k gold-plated brass', note: 'Three chains, 40 / 45 / 50 cm',
    desc: 'Three chains in different textures finished with a hammered coin. A whole look in one piece.', stock: 6 },
  { id: 'TH-N07', slug: 'ginkgo-leaf-pendant', name: 'Ginkgo Leaf Pendant', collection: 'necklaces', price: 2190, img: '1620656798579-1984d9e87df7',
    material: '18k gold-plated sterling silver', note: 'Chain 45 cm',
    desc: 'A small ginkgo leaf, the symbol of resilience, hand-finished with a soft brushed texture.', stock: 10 },

  { id: 'TH-B01', slug: 'filigree-rose-bracelet', name: 'Filigree Rose Bracelet', collection: 'bracelets', price: 3490, img: '1611591437281-460bfbe1220a',
    material: 'Rose gold-plated brass, CZ', note: 'Fits wrists 15–17 cm',
    desc: 'Lacy filigree links set with tiny stones. Delicate, but made to be worn every day.', stock: 5 },
  { id: 'TH-B02', slug: 'paperclip-chain-bracelet', name: 'Paperclip Chain Bracelet', collection: 'bracelets', price: 1690, img: '1633810543462-77c4a3b13f07',
    material: '18k gold-plated sterling silver', note: 'Adjustable 16–19 cm',
    desc: 'Our bestselling everyday bracelet. Elongated links with a T-bar you can hang charms from.', stock: 21 },
  { id: 'TH-B03', slug: 'chunky-link-bracelet', name: 'Chunky Link Bracelet', collection: 'bracelets', price: 2690, img: '1602173574767-37ac01994b2a',
    material: '18k gold-plated brass', note: 'Lobster clasp · 18 cm',
    desc: 'Bold, polished oval links that make a statement on their own.', stock: 8 },

  { id: 'TH-R01', slug: 'stacking-ring-set', name: 'Stacking Ring Set', collection: 'rings', price: 2390, img: '1543294001-f7cd5d7fb516',
    material: '18k gold-plated sterling, CZ', note: 'Set of 3 · sizes 6–9',
    desc: 'Three textured bands, one with a heart, one with a round stone, made to be worn together or apart.', stock: 9, sizes: [6, 7, 8, 9] },
  { id: 'TH-R02', slug: 'gemstone-cocktail-rings', name: 'Gemstone Cocktail Ring', collection: 'rings', price: 1990, img: '1608042314453-ae338d80c427',
    material: 'Gold-plated sterling, natural stone', note: 'Choose your stone · sizes 6–9',
    desc: 'A chunky band with a polished natural stone. Each stone is unique, so yours will differ slightly.', stock: 11, sizes: [6, 7, 8, 9], options: ['Carnelian', 'Amazonite', 'Moonstone'] }
];

function findProduct(slug) {
  for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
  return null;
}

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}
