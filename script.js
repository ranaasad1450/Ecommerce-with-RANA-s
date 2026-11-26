/* ==================== BACKEND INTEGRATION LAYER (Node.js / Express) ====================
   This store ships as a self-contained static build: products, cart, wishlist and
   checkout run 100% in the browser (localStorage), so the file works by simply
   opening it — no server needed.

   To connect a real Node.js backend later, set USE_API = true and implement:

     GET    /api/products            → all products (JSON array, same shape as PRODUCTS below)
     GET    /api/products/:id        → single product
     GET    /api/deals               → flash-deal products
     POST   /api/orders              → place order { customer: {...}, items: [...], total }
     POST   /api/newsletter          → subscribe email
     POST   /api/cart                → (optional) persist cart for logged-in users

   Example Express route:
     app.get('/api/products', (req, res) => res.json(db.products));

   Then replace the local PRODUCTS array with:
     const PRODUCTS = await (await fetch('/api/products')).json();
======================================================================================== */
const USE_API = false; // static demo mode

/* ==================== DATA ==================== */
const PRODUCTS = [
  {id:1, name:'Studio Pro Wireless Headphones', cat:'Electronics', price:14999, old:19999, rating:4.8, rev:2340, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a7f46ba23fab.png', tag:null, sold:82, desc:'Flagship over-ear headphones with hybrid active noise cancellation, 40-hour battery life and plush memory-foam cups for all-day comfort.'},
  {id:2, name:'Pulse Smartwatch Series 5', cat:'Electronics', price:8999, old:11999, rating:4.6, rev:1876, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f0609425f67.jpg', tag:null, sold:58, desc:'AMOLED always-on display, SpO2 + heart-rate tracking, 120 sport modes and 10-day battery — your perfect daily fitness companion.'},
  {id:3, name:'AirBuds Pro with Charging Case', cat:'Electronics', price:4499, old:5999, rating:4.5, rev:3102, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b27ee93f867.jpg', tag:'New', sold:64, desc:'True wireless earbuds with ENC calling, ultra-low-latency gaming mode and a pocketable charging case that adds 24 hours of playtime.'},
  {id:4, name:'BoomBox Mini Bluetooth Speaker', cat:'Electronics', price:6499, old:7999, rating:4.4, rev:980, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/73f13ff11981.jpg', tag:null, sold:37, desc:'Punchy 360° sound in a rugged IPX7 waterproof body. Pair two for stereo and take the party anywhere — 16-hour battery included.'},
  {id:5, name:'Apex 4K Action Camera', cat:'Electronics', price:24999, old:29999, rating:4.7, rev:745, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f567015fe1f.jpg', tag:null, sold:45, desc:'Shoot buttery 4K60 video with dual screens, EIS 3.0 stabilization and a waterproof housing rated to 40 m — built for adventurers.'},
  {id:6, name:'Cloudwalk Classic Sneakers', cat:'Fashion', price:7999, old:9499, rating:4.6, rev:1520, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ba70f96f0076.webp', tag:null, sold:52, desc:'Breathable knit upper on a cloud-soft EVA sole. The everyday sneaker that pairs with jeans, joggers and everything in between.'},
  {id:7, name:'Milano Leather Handbag', cat:'Fashion', price:9499, old:12999, rating:4.8, rev:1132, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a560d7423788.jpg', tag:null, sold:64, desc:'Full-grain leather tote with gold-tone hardware, laptop-sized interior and detachable shoulder strap — office to evening in one bag.'},
  {id:8, name:'Golden Hour Aviator Sunglasses', cat:'Fashion', price:3999, old:0, rating:4.3, rev:640, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/603861dbc72e.png', tag:'New', sold:28, desc:'UV400 polarized lenses in a featherlight stainless-steel frame. Unisex aviators that never go out of style.'},
  {id:9, name:'Slate Minimalist Wristwatch', cat:'Fashion', price:12499, old:14999, rating:4.7, rev:887, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7674f2b65cd3.jpg', tag:null, sold:41, desc:'A clean 40 mm dial, sapphire-coated glass and Japanese quartz movement on a genuine leather strap. Quiet luxury, every day.'},
  {id:10, name:'Serene Aroma Diffuser', cat:'Home & Living', price:5499, old:0, rating:4.5, rev:754, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/312d44ff1021.png', tag:null, sold:33, desc:'Ultrasonic cool-mist diffuser with 7 ambient light colors and whisper-quiet operation. Turns any room into a spa.'},
  {id:11, name:'BrewMaster French Press', cat:'Home & Living', price:6999, old:8499, rating:4.6, rev:498, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b8f94ac3fb12.jpg', tag:null, sold:26, desc:'Borosilicate glass with a double stainless-steel filter for rich, grit-free coffee. Brews 350 ml — perfect for slow mornings.'},
  {id:12, name:'Halo LED Desk Lamp', cat:'Home & Living', price:3499, old:4499, rating:4.4, rev:613, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a1be2c530524.jpg', tag:null, sold:47, desc:'Flicker-free light with 3 color temperatures, stepless dimming and a USB charging port built right into the base.'},
  {id:13, name:'GlowUp Vitamin C Serum', cat:'Beauty', price:2899, old:0, rating:4.7, rev:2045, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8036e2921338.jpg', tag:'New', sold:76, desc:'15% stabilized vitamin C with hyaluronic acid — visibly brighter, smoother skin in 4 weeks. Dermatologist tested.'},
  {id:14, name:'Velvet Oud Luxury Perfume', cat:'Beauty', price:7499, old:9999, rating:4.9, rev:1367, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a1c6fac84dd5.jpg', tag:null, sold:71, desc:'An intoxicating blend of oud, rose and amber with 12-hour longevity. Extrait de parfum concentration in a 50 ml bottle.'},
  {id:15, name:'ZenFlex Pro Yoga Mat', cat:'Sports', price:2499, old:0, rating:4.5, rev:521, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c37fcceaf841.jpg', tag:null, sold:30, desc:'6 mm eco-TPE mat with alignment lines, non-slip texture and a carry strap. Cushions knees while keeping balance poses steady.'},
  {id:16, name:'SprintX Running Shoes', cat:'Sports', price:8499, old:10499, rating:4.6, rev:932, img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/462f56bce06c.jpg', tag:null, sold:55, desc:'Responsive foam midsole with a breathable mesh upper — engineered for 5Ks, marathons and everything in between.'}
];
const DEAL_IDS = [1, 7, 14, 5];
const SHIP_FEE = 199, FREE_SHIP_OVER = 5000;
const CD_MS = 8 * 3600 * 1000;

/* ==================== STATE + PERSISTENCE ==================== */
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
const state = {
  cart: store.get('zy_cart', []),
  wish: store.get('zy_wish', []),
  cat: 'All', search: '', maxPrice: 30000, sort: 'featured',
  qvId: null, qvQty: 1
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const byId = id => PRODUCTS.find(p => p.id === +id);
const fmt = n => 'Rs ' + n.toLocaleString('en-US');
const fmtK = n => n >= 1000 ? (n/1000).toFixed(1).replace('.0','') + 'k' : n;
const disc = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

/* ==================== ICONS / PARTIALS ==================== */
const I = {
  heart: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  cart: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  eye: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  trash: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>',
  check: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
};
const starSvg = on => `<svg class="icon-sm" viewBox="0 0 24 24" fill="${on ? 'var(--star)' : 'var(--star-off)'}"><path d="M12 2l2.9 6.26 6.6.57-5 4.44 1.5 6.47L12 16.9 5.99 19.74l1.5-6.47-5-4.44 6.6-.57z"/></svg>`;
const starsHtml = r => {
  const full = Math.round(r);
  let h = '';
  for (let i = 0; i < 5; i++) h += starSvg(i < full);
  return h;
};

/* ==================== TOASTS ==================== */
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = (type === 'error' ? '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg>'
    : type === 'info' ? '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5m0-3h.01"/></svg>'
    : I.check) + `<span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 320); }, 2600);
}

/* ==================== RENDER: PRODUCT GRID ==================== */
function filtered() {
  let list = PRODUCTS.filter(p =>
    (state.cat === 'All' || p.cat === state.cat) &&
    p.price <= state.maxPrice &&
    (!state.search || (p.name + ' ' + p.cat).toLowerCase().includes(state.search.toLowerCase()))
  );
  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  return list;
}
function cardHtml(p) {
  const inWish = state.wish.includes(p.id);
  const badge = p.old ? `<span class="badge-off">-${disc(p)}%</span>` : (p.tag ? `<span class="badge-new">${p.tag}</span>` : '');
  return `<article class="card">
    <div class="card-img" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      ${badge}
      <button class="qv-btn" data-qv="${p.id}">${I.eye} Quick View</button>
      <button class="heart-btn ${inWish ? 'on' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist for ${p.name}">${I.heart}</button>
    </div>
    <div class="card-body">
      <span class="card-cat">${p.cat}</span>
      <h3 class="card-name">${p.name}</h3>
      <div class="stars">${starsHtml(p.rating)}<span class="num">${p.rating} · ${fmtK(p.rev)} reviews</span></div>
      <div class="card-foot">
        <div class="price-box"><span class="p">${fmt(p.price)}</span>${p.old ? `<span class="o">${fmt(p.old)}</span>` : ''}</div>
        <button class="add-btn" data-add="${p.id}">${I.cart} Add</button>
      </div>
    </div>
  </article>`;
}
function renderGrid() {
  const list = filtered();
  $('#prodGrid').innerHTML = list.length ? list.map(cardHtml).join('')
    : `<div class="empty-state">${I.heart.replace('class="icon"', 'class="icon"')}<b>No products found</b>Try a different category, price range or search term.</div>`;
  const q = state.search ? ` for “<b>${state.search}</b>”` : '';
  $('#resultsNote').innerHTML = `Showing <b>${list.length}</b> of ${PRODUCTS.length} products${q}${state.cat !== 'All' ? ` in <b>${state.cat}</b>` : ''}`;
}
function renderDeals() {
  $('#dealRow').innerHTML = DEAL_IDS.map(id => {
    const p = byId(id);
    return `<div class="deal-card" data-qv="${p.id}" tabindex="0" role="button" aria-label="Quick view ${p.name}">
      <div class="dimg"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <b>${p.name}</b>
      <div class="dprice"><span class="now">${fmt(p.price)}</span><span class="old">${fmt(p.old)}</span></div>
      <div class="sold-line"><span>Sold: ${p.sold}% · Only ${Math.round((100 - p.sold) * 2.4)} left</span>
        <div class="bar"><i style="width:${p.sold}%"></i></div></div>
    </div>`;
  }).join('');
}

/* ==================== CART ==================== */
function cartQty(){ return state.cart.reduce((s, c) => s + c.qty, 0); }
function cartSub(){ return state.cart.reduce((s, c) => s + c.qty * byId(c.id).price, 0); }
function shipLabel(sub){
  if (!sub) return '—';
  return sub >= FREE_SHIP_OVER ? '<span class="free">FREE</span>' : fmt(SHIP_FEE);
}
function updateBadges() {
  const n = cartQty();
  const cb = $('#cartCount');
  cb.textContent = n; cb.hidden = !n;
  $('#wishCount').textContent = state.wish.length;
  $('#wishCount').hidden = !state.wish.length;
}
function bumpBadge(){ const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function addToCart(id, qty = 1) {
  const line = state.cart.find(c => c.id === +id);
  if (line) line.qty = Math.min(99, line.qty + qty); else state.cart.push({ id: +id, qty });
  store.set('zy_cart', state.cart);
  renderCart(); updateBadges(); bumpBadge();
  toast(`${byId(id).name} added to cart`);
}
function renderCart() {
  const box = $('#cartItems');
  $('#cartPill').textContent = cartQty() + (cartQty() === 1 ? ' item' : ' items');
  if (!state.cart.length) {
    box.innerHTML = `<div class="empty-state">${I.cart.replace('icon-sm','icon')}<b>Your cart is empty</b>Explore the store and add something you love.</div>`;
    $('#cartSubtotal').textContent = fmt(0); $('#cartShipping').textContent = '—'; $('#cartTotal').textContent = fmt(0);
    $('#checkoutBtn').disabled = true;
    return;
  }
  $('#checkoutBtn').disabled = false;
  box.innerHTML = state.cart.map(c => {
    const p = byId(c.id);
    return `<div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div class="ci-info"><b>${p.name}</b><div class="ci-price">${fmt(p.price)}</div>
        <div class="ci-row">
          <div class="qty" data-line="${c.id}">
            <button data-qdec aria-label="Decrease">−</button><output>${c.qty}</output><button data-qinc aria-label="Increase">+</button>
          </div>
          <button class="ci-del" data-del="${c.id}" aria-label="Remove ${p.name}">${I.trash}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const sub = cartSub();
  $('#cartSubtotal').textContent = fmt(sub);
  $('#cartShipping').innerHTML = shipLabel(sub);
  $('#cartTotal').textContent = fmt(sub + (sub && sub < FREE_SHIP_OVER ? SHIP_FEE : 0));
}

/* ==================== WISHLIST ==================== */
function toggleWish(id) {
  const i = state.wish.indexOf(+id);
  if (i > -1) { state.wish.splice(i, 1); toast('Removed from wishlist', 'info'); }
  else { state.wish.push(+id); toast('Saved to wishlist ❤️'); }
  store.set('zy_wish', state.wish);
  renderWish(); updateBadges(); renderGrid();
}
function renderWish() {
  const box = $('#wishItems');
  $('#wishPill').textContent = state.wish.length + (state.wish.length === 1 ? ' item' : ' items');
  if (!state.wish.length) {
    box.innerHTML = `<div class="empty-state">${I.heart.replace('class="icon"','class="icon"')}<b>Your wishlist is empty</b>Tap the heart on any product to save it here.</div>`;
    return;
  }
  box.innerHTML = state.wish.map(id => {
    const p = byId(id);
    return `<div class="wl-item">
      <img src="${p.img}" alt="${p.name}">
      <div class="wl-info"><b>${p.name}</b><span>${fmt(p.price)}</span></div>
      <button class="wl-move" data-wmove="${id}">Move to Cart</button>
    </div>`;
  }).join('');
}

/* ==================== DRAWERS & MODALS ==================== */
function lockIf(){ document.body.classList.toggle('lock', $$('.drawer.open,.modal.open,.mnav.open').length > 0); }
function openDrawer(el){ el.classList.add('open'); $('#scrim').classList.add('show'); lockIf(); }
function closeDrawer(el){ el.classList.remove('open'); $('#scrim').classList.remove('show'); lockIf(); }
function openModal(el){ el.classList.add('open'); lockIf(); }
function closeModal(el){ el.classList.remove('open'); lockIf(); if (el.id === 'coModal') resetCheckout(); }

/* ==================== QUICK VIEW ==================== */
function openQV(id) {
  const p = byId(id); state.qvId = +id; state.qvQty = 1;
  $('#qvImg').src = p.img; $('#qvImg').alt = p.name;
  $('#qvCat').textContent = p.cat; $('#qvName').textContent = p.name;
  $('#qvStars').innerHTML = starsHtml(p.rating) + `<span class="num">${p.rating} · ${fmtK(p.rev)} reviews</span>`;
  $('#qvDesc').textContent = p.desc;
  $('#qvPrice').textContent = fmt(p.price);
  $('#qvOld').textContent = p.old ? fmt(p.old) : '';
  $('#qvOld').style.display = p.old ? '' : 'none';
  $('#qvOff').textContent = p.old ? `-${disc(p)}%` : '';
  $('#qvOff').style.display = p.old ? '' : 'none';
  $('#qvQty').textContent = 1;
  openModal($('#qvModal'));
}

/* ==================== CHECKOUT ==================== */
function renderCheckout() {
  const sub = cartSub();
  $('#coItems').innerHTML = state.cart.map(c => {
    const p = byId(c.id);
    return `<div class="co-item"><span>${p.name}</span><span class="cq">× ${c.qty}</span><span>${fmt(p.price * c.qty)}</span></div>`;
  }).join('');
  $('#coSubtotal').textContent = fmt(sub);
  $('#coShipping').innerHTML = shipLabel(sub);
  $('#coTotal').textContent = fmt(sub + (sub < FREE_SHIP_OVER ? SHIP_FEE : 0));
}
function resetCheckout() {
  $('#coMain').style.display = '';
  $('#coSuccess').classList.remove('show');
  $('#coForm').reset();
  $$('.fld input,.fld select,.fld textarea').forEach(el => el.classList.remove('err'));
}
async function placeOrder() {
  const name = $('#coName'), phone = $('#coPhone'), addr = $('#coAddress'), city = $('#coCity');
  let ok = true;
  const mark = (el, bad) => { el.classList.toggle('err', bad); if (bad) ok = false; };
  mark(name, name.value.trim().length < 3);
  const digits = phone.value.replace(/\D/g, '');
  mark(phone, digits.length < 10 || digits.length > 13);
  mark(addr, addr.value.trim().length < 10);
  mark(city, !city.value);
  if (!ok) { toast('Please fill all fields correctly', 'error'); return; }
  if (!state.cart.length) { toast('Your cart is empty', 'error'); return; }

  const pay = document.querySelector('input[name="pay"]:checked').value;
  const oid = 'RS-' + Math.floor(100000 + Math.random() * 900000);
  const subtotal = cartSub();
  const shipping = subtotal && subtotal < FREE_SHIP_OVER ? SHIP_FEE : 0;
  const total = subtotal + shipping;
  const items = state.cart.map(line => {
    const p = byId(line.id);
    return { product_id: p.id, name: p.name, price: p.price, quantity: line.qty, image: p.img };
  });

  const btn = $('#placeOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Saving Order...';
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        order_number: oid,
        customer_name: name.value.trim(),
        phone: phone.value.trim(),
        address: addr.value.trim(),
        city: city.value,
        payment_method: pay,
        items,
        total
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `HTTP ${response.status}`);
    }

    $('#orderId').textContent = oid;
    $('#coMain').style.display = 'none';
    $('#coSuccess').classList.add('show');
    state.cart = [];
    store.set('zy_cart', state.cart);
    renderCart(); updateBadges();
    toast('Order saved successfully — ' + pay + ' 🎉');
  } catch (error) {
    console.error('Order save failed:', error);
    toast('Order save nahi hua. Internet ya Supabase settings check karein.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}

/* ==================== COUNTDOWN ==================== */
function initCountdown() {
  let end = store.get('zy_deal_end', 0);
  if (!end || end < Date.now()) { end = Date.now() + CD_MS; store.set('zy_deal_end', end); }
  const tick = () => {
    let d = Math.max(0, end - Date.now());
    const h = Math.floor(d / 3600000), m = Math.floor(d / 60000) % 60, s = Math.floor(d / 1000) % 60;
    $('#cdH').textContent = String(h).padStart(2, '0');
    $('#cdM').textContent = String(m).padStart(2, '0');
    $('#cdS').textContent = String(s).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
}

/* ==================== THEME ==================== */
const SUN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#themeIcon').outerHTML = (t === 'dark' ? SUN : MOON).replace('class="icon"', 'class="icon" id="themeIcon"');
  store.set('zy_theme', t);
}
function initTheme() {
  const saved = store.get('zy_theme', null);
  const sys = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = saved || sys;
  $('#themeIcon').outerHTML = ((saved || sys) === 'dark' ? SUN : MOON).replace('class="icon"', 'class="icon" id="themeIcon"');
}

/* ==================== EVENTS ==================== */
document.addEventListener('click', e => {
  const t = e.target;
  const add = t.closest('[data-add]');
  if (add) {
    addToCart(add.dataset.add);
    add.classList.add('done'); add.innerHTML = I.check + ' Added';
    setTimeout(() => { add.classList.remove('done'); add.innerHTML = I.cart + ' Add'; }, 1100);
    return;
  }
  const wish = t.closest('[data-wish]');
  if (wish) { toggleWish(wish.dataset.wish); return; }
  const wmove = t.closest('[data-wmove]');
  if (wmove) { addToCart(wmove.dataset.wmove); toggleWish(wmove.dataset.wmove); return; }
  const del = t.closest('[data-del]');
  if (del) { state.cart = state.cart.filter(c => c.id !== +del.dataset.del); store.set('zy_cart', state.cart); renderCart(); updateBadges(); toast('Item removed', 'info'); return; }
  const qinc = t.closest('[data-qinc]'), qdec = t.closest('[data-qdec]');
  if (qinc || qdec) {
    const lineEl = (qinc || qdec).closest('[data-line]');
    const line = state.cart.find(c => c.id === +lineEl.dataset.line);
    if (line) {
      line.qty = Math.min(99, Math.max(1, line.qty + (qinc ? 1 : -1)));
      store.set('zy_cart', state.cart); renderCart(); updateBadges();
    }
    return;
  }
  const qv = t.closest('[data-qv]');
  if (qv && !t.closest('[data-wish]')) { openQV(qv.dataset.qv); return; }
  const chip = t.closest('.chip[data-cat]');
  if (chip) { setCat(chip.dataset.cat); return; }
  const catCard = t.closest('.cat-card[data-cat]');
  if (catCard) { setCat(catCard.dataset.cat); $('#shop').scrollIntoView({ behavior: 'smooth' }); return; }
  const shopCat = t.closest('[data-shop-cat]');
  if (shopCat) { setCat(shopCat.dataset.shopCat); return; }
  const closeD = t.closest('[data-close-drawer]');
  if (closeD) { closeDrawer(closeD.closest('.drawer')); return; }
  const closeM = t.closest('[data-close-modal]');
  if (closeM) { closeModal(closeM.closest('.modal')); return; }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { $$('.modal.open').forEach(closeModal); $$('.drawer.open').forEach(closeDrawer); $('#mnav').classList.remove('open'); $('#scrim').classList.remove('show'); lockIf(); }
  const qvCard = e.target.closest && e.target.closest('[data-qv][role="button"]');
  if (e.key === 'Enter' && qvCard) openQV(qvCard.dataset.qv);
});
$('#scrim').addEventListener('click', () => { $$('.drawer.open').forEach(closeDrawer); $('#mnav').classList.remove('open'); });
$('#cartBtn').addEventListener('click', () => openDrawer($('#cartDrawer')));
$('#wishBtn').addEventListener('click', () => openDrawer($('#wishDrawer')));
$('#checkoutBtn').addEventListener('click', () => {
  if (!state.cart.length) { toast('Your cart is empty', 'error'); return; }
  closeDrawer($('#cartDrawer')); renderCheckout(); openModal($('#coModal'));
});
$('#placeOrderBtn').addEventListener('click', placeOrder);
$('#qvPlus').addEventListener('click', () => { state.qvQty = Math.min(10, state.qvQty + 1); $('#qvQty').textContent = state.qvQty; });
$('#qvMinus').addEventListener('click', () => { state.qvQty = Math.max(1, state.qvQty - 1); $('#qvQty').textContent = state.qvQty; });
$('#qvAdd').addEventListener('click', () => { addToCart(state.qvId, state.qvQty); closeModal($('#qvModal')); });
$('#themeBtn').addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#menuBtn').addEventListener('click', () => { $('#mnav').classList.add('open'); $('#scrim').classList.add('show'); lockIf(); });
$('#mnavClose').addEventListener('click', () => { $('#mnav').classList.remove('open'); $('#scrim').classList.remove('show'); lockIf(); });
$$('#mnav .mlink, #mnav .logo').forEach(a => a.addEventListener('click', () => { $('#mnav').classList.remove('open'); $('#scrim').classList.remove('show'); lockIf(); }));

function setCat(cat) {
  state.cat = cat;
  $$('#catChips .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  $$('.cat-card').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  renderGrid();
  $('#shop').scrollIntoView({ behavior: 'smooth' });
}
$('#catChips').addEventListener('click', e => { if (e.target.closest('.chip')) return; });
$('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
$('#priceRange').addEventListener('input', e => {
  state.maxPrice = +e.target.value;
  $('#priceOut').textContent = fmt(state.maxPrice);
  renderGrid();
});
function bindSearch(input) {
  input.addEventListener('input', () => {
    state.search = input.value; renderGrid();
    if (input.value.length === 1) $('#shop').scrollIntoView({ behavior: 'smooth' });
  });
}
bindSearch($('#searchInput')); bindSearch($('#mnavSearch'));
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
$('#mnavSearchForm').addEventListener('submit', e => {
  e.preventDefault(); $('#mnav').classList.remove('open'); $('#scrim').classList.remove('show'); lockIf();
  $('#shop').scrollIntoView({ behavior: 'smooth' });
});
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = $('#newsEmail').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast('Please enter a valid email', 'error'); return; }
  toast("You're in! Welcome coupon is on its way 🎉");
  e.target.reset();
});

/* ==================== REVEAL ON SCROLL ==================== */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
function revealNow() {
  $$('.rv').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 1.25) { el.classList.add('in'); io.unobserve(el); }
  });
}
$$('.rv').forEach(el => io.observe(el));
revealNow();
window.addEventListener('load', revealNow);
setTimeout(() => { $$('.rv').forEach(el => el.classList.add('in')); io.disconnect(); }, 3500);

/* ==================== INIT ==================== */
(function init(){
  initTheme();
  renderGrid(); renderDeals(); renderCart(); renderWish(); updateBadges();
  initCountdown();
  $('#year').textContent = new Date().getFullYear();
})();
