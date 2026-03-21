/* ═══════════════════════════════════════
   FORMA FURNITURE — SHARED JAVASCRIPT
   Cart · Checkout · Offer Form · Nav
═══════════════════════════════════════ */

/* ─── PRODUCT CATALOGUE ─── */
const PRODUCTS = [
  { id:1,  name:'Seto Lounge Chair',    cat:'Seating',  price:38500, oldPrice:45000, emoji:'🪑', badge:'Bestseller',  desc:'Solid oak frame with premium boucle upholstery. Ergonomically designed for long hours of comfort.' },
  { id:2,  name:'Tochi Dining Table',   cat:'Tables',   price:92000, oldPrice:null,  emoji:'🪵', badge:null,          desc:'6-seater solid walnut dining table with natural edge detailing. Heirloom quality.' },
  { id:3,  name:'Kaze Modular Sofa',    cat:'Seating',  price:125000,oldPrice:148000,emoji:'🛋️', badge:'New',         desc:'Reconfigurable 3-seater with premium Belgian linen. Available in 12 fabric options.' },
  { id:4,  name:'Yama Bookshelf',       cat:'Storage',  price:54000, oldPrice:null,  emoji:'📚', badge:null,          desc:'Geometric open shelving in blackened steel and ash wood. Holds up to 200 kg.' },
  { id:5,  name:'Ishi Coffee Table',    cat:'Tables',   price:28500, oldPrice:32000, emoji:'🪨', badge:'Sale',        desc:'Hand-poured concrete top on a powder-coated steel base. Indoor/outdoor use.' },
  { id:6,  name:'Tsuki Bed Frame',      cat:'Bedroom',  price:68000, oldPrice:null,  emoji:'🛏️', badge:null,          desc:'Low-profile platform bed in solid cherry wood. Available in Queen and King.' },
  { id:7,  name:'Hana Dining Chair',    cat:'Seating',  price:18500, oldPrice:22000, emoji:'🪑', badge:'Sale',        desc:'Sculpted saddle-seat dining chair in beech wood. Set of 2 available.' },
  { id:8,  name:'Kuro Side Table',      cat:'Tables',   price:14500, oldPrice:null,  emoji:'🔲', badge:null,          desc:'Blackened steel hairpin legs with solid marble top. Compact and versatile.' },
  { id:9,  name:'Haru Sideboard',       cat:'Storage',  price:76000, oldPrice:88000, emoji:'🗄️', badge:'Sale',        desc:'3-door sideboard in natural ash veneer with brass hardware. Ample hidden storage.' },
  { id:10, name:'Nami Dresser',         cat:'Bedroom',  price:58000, oldPrice:null,  emoji:'🪞', badge:'New',         desc:'5-drawer dresser with integrated mirror. Dovetail joinery throughout.' },
  { id:11, name:'Mori Accent Chair',    cat:'Seating',  price:32000, oldPrice:36000, emoji:'💺', badge:null,          desc:'Curved shell chair in moulded walnut veneer. Statement piece for any corner.' },
  { id:12, name:'Sora Nightstand',      cat:'Bedroom',  price:12500, oldPrice:null,  emoji:'🕯️', badge:null,          desc:'Floating nightstand with single drawer. Solid oak top, blackened steel bracket.' },
];

/* ─── STATE ─── */
let cart = JSON.parse(localStorage.getItem('forma_cart') || '[]');
let checkoutStep = 1;
let payMethod = 'card';

function saveCart() { localStorage.setItem('forma_cart', JSON.stringify(cart)); }
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

/* ─── NAV SCROLL ─── */
function initNav() {
  const nb = document.querySelector('.navbar');
  if (!nb) return;
  window.addEventListener('scroll', () => {
    nb.classList.toggle('scrolled', window.scrollY > 30);
  });
  // Hamburger
  const ham = document.getElementById('navHam');
  const mob = document.getElementById('mobileMenu');
  if (ham && mob) {
    ham.addEventListener('click', () => mob.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!nb.contains(e.target)) mob.classList.remove('open');
    });
  }
  // Active link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-center a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

/* ─── CART ─── */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`${p.name} added to cart`);
  const btn = document.getElementById('addbtn-' + id);
  if (btn) {
    btn.textContent = '✓ Added';
    btn.style.background = 'var(--green)';
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1600);
  }
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartUI();
}

function cartTotals() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const del = sub >= 50000 ? 0 : 2500;
  return { sub, del, total: sub + del };
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
    b.classList.toggle('show', count > 0);
  });

  const bodyEl = document.getElementById('cartBody');
  const footEl = document.getElementById('cartFoot');
  if (!bodyEl) return;

  if (!cart.length) {
    bodyEl.innerHTML = `<div class="cart-empty-state"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add some pieces to get started</p></div>`;
    if (footEl) footEl.style.display = 'none';
    return;
  }

  bodyEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">${item.emoji}</div>
      <div class="cart-item-body">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${item.cat}</div>
        <div class="cart-item-price">${fmt(item.price)}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  if (footEl) {
    footEl.style.display = 'block';
    const { sub, del, total } = cartTotals();
    document.getElementById('cartSub').textContent = fmt(sub);
    document.getElementById('cartDel').textContent = del ? fmt(del) : 'Free';
    document.getElementById('cartTotal').textContent = fmt(total);
  }
}

function openCart() { document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartOverlay').classList.remove('open'); }

/* ─── CHECKOUT ─── */
function beginCheckout() {
  if (!cart.length) { showToast('Your cart is empty'); return; }
  closeCart();
  checkoutStep = 1;
  renderCheckoutStep(1);
  document.getElementById('checkoutVeil').classList.add('open');
}

function closeCheckout() { document.getElementById('checkoutVeil').classList.remove('open'); }

function renderCheckoutStep(n) {
  checkoutStep = n;
  [1,2,3,'S'].forEach(s => {
    const p = document.getElementById('coPanel' + s);
    const t = document.getElementById('coTab' + s);
    if (p) p.classList.remove('active');
    if (t) { t.classList.remove('active', 'done'); }
  });
  document.getElementById('coPanel' + n).classList.add('active');
  const tab = document.getElementById('coTab' + n);
  if (tab) tab.classList.add('active');
  // mark done
  for (let i = 1; i < n; i++) {
    const t = document.getElementById('coTab' + i);
    if (t) t.classList.add('done');
  }
  if (n === 3) buildReview();
}

function goCoNext(n) { renderCheckoutStep(n); }

function selectPayment(el, method) {
  payMethod = method;
  document.querySelectorAll('.pay-tile').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  ['cardFields','upiFields','emiFields','codFields'].forEach(id => {
    const el2 = document.getElementById(id);
    if (el2) el2.style.display = 'none';
  });
  const target = document.getElementById(method + 'Fields');
  if (target) target.style.display = 'block';
}

function buildReview() {
  const list = document.getElementById('reviewList');
  const { sub, del, total } = cartTotals();
  if (list) {
    list.innerHTML = cart.map(i =>
      `<div class="review-line"><span>${i.name} × ${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`
    ).join('') +
    `<div class="review-line"><span>Delivery</span><span>${del ? fmt(del) : 'Free'}</span></div>
     <div class="review-total"><span>Total</span><span>${fmt(total)}</span></div>`;
  }
  const addr = document.getElementById('coAddr1');
  const city = document.getElementById('coCity');
  const fn = document.getElementById('coFName');
  const ln = document.getElementById('coLName');
  const ds = document.getElementById('deliverySummary');
  if (ds && fn) {
    ds.innerHTML = `<strong>${fn.value || '—'} ${ln ? ln.value : ''}</strong><br>
      ${addr ? addr.value || '—' : '—'}, ${city ? city.value || '—' : '—'}`;
  }
}

function placeOrder() {
  const orderId = 'FO-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('orderIdDisplay').textContent = 'Order #' + orderId;
  [1,2,3].forEach(n => {
    const p = document.getElementById('coPanel' + n);
    if (p) p.classList.remove('active');
  });
  document.getElementById('coPanelS').classList.add('active');
  cart = []; saveCart(); updateCartUI();
}

function formatCardNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
  el.value = v;
}

/* ─── OFFER FORM ─── */
function openOffer() { document.getElementById('offerVeil').classList.add('open'); }
function closeOffer() { document.getElementById('offerVeil').classList.remove('open'); }

function submitOffer(e) {
  e.preventDefault();
  document.getElementById('offerFormEl').style.display = 'none';
  document.getElementById('offerSuccess').style.display = 'block';
  showToast('Request sent! We\'ll be in touch shortly.');
}

/* ─── TOAST ─── */
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ─── PRODUCT CARD RENDERER (used by shop + home) ─── */
function renderProductCards(selector, items) {
  const grid = document.querySelector(selector);
  if (!grid) return;
  grid.innerHTML = items.map(p => `
    <div class="prod-card" data-id="${p.id}">
      <div class="prod-thumb">
        <div class="prod-emoji">${p.emoji}</div>
        ${p.badge ? `<div class="prod-badge">${p.badge}</div>` : ''}
        <button class="prod-quick" onclick="addToCart(${p.id})">Quick Add</button>
      </div>
      <div class="prod-info">
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-foot">
          <div class="prod-price">
            ${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}
            <strong>${fmt(p.price)}</strong>
          </div>
          <button class="prod-atc" id="addbtn-${p.id}" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── INIT ON LOAD ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  updateCartUI();
  // Offer form submit
  const ofForm = document.getElementById('offerFormEl');
  if (ofForm) ofForm.addEventListener('submit', submitOffer);
  // Cart overlay bg click to close
  const co = document.getElementById('cartOverlay');
  if (co) co.addEventListener('click', e => { if (e.target === co) closeCart(); });
  const cv = document.getElementById('checkoutVeil');
  if (cv) cv.addEventListener('click', e => { if (e.target === cv) closeCheckout(); });
  const ov = document.getElementById('offerVeil');
  if (ov) ov.addEventListener('click', e => { if (e.target === ov) closeOffer(); });
});
