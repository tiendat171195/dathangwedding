
// Inject hero images and gallery, slideshow, RSVP handlers, Add-to-calendar

// HERO
const HERO = [];
HERO.push("assets/hero/hero-1.jpg");
HERO.push("assets/hero/hero-2.jpg");
HERO.push("assets/hero/hero-3.jpg");
HERO.push("assets/hero/hero-4.jpg");
HERO.push("assets/hero/hero-5.jpg");
HERO.push("assets/hero/hero-6.jpg");
HERO.push("assets/hero/hero-7.jpg");
HERO.push("assets/hero/hero-8.jpg");
// Add gallery images as additional hero backgrounds
HERO.push("assets/gallery/g-023.jpg");
HERO.push("assets/gallery/g-025.jpg");
HERO.push("assets/gallery/g-029.jpg");
HERO.push("assets/gallery/g-032.jpg");
HERO.push("assets/gallery/g-037.jpg");
HERO.push("assets/gallery/g-038.jpg");
HERO.push("assets/gallery/g-039.jpg");
HERO.push("assets/gallery/g-040.jpg");
HERO.push("assets/gallery/g-041.jpg");
HERO.push("assets/gallery/g-042.jpg");
const slidesWrap = document.querySelector('.hero-slides');
slidesWrap.innerHTML = HERO.map((src,i)=>`<img src="${src}" class="slide ${i===0?'active':''}" alt="Hero ${i+1}" data-focal="50% 50%">`).join('');

const slides = document.querySelectorAll('.slide');
let slideIndex = 0;
function applyFocal(img){
  const focal = img.getAttribute('data-focal') || '50% 50%';
  img.style.objectPosition = focal;
}
function nextSlide(){
  slides[slideIndex].classList.remove('active');
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add('active');
  applyFocal(slides[slideIndex]);
}
if (slides.length){
  applyFocal(slides[slideIndex]);
  setInterval(nextSlide, 3500);
}

// GALLERY
const GALLERY = [];
GALLERY.push("assets/gallery/g-023.jpg");
GALLERY.push("assets/gallery/g-024.jpg");
GALLERY.push("assets/gallery/g-025.jpg");
GALLERY.push("assets/gallery/g-026.jpg");
GALLERY.push("assets/gallery/g-027.jpg");
GALLERY.push("assets/gallery/g-028.jpg");
GALLERY.push("assets/gallery/g-029.jpg");
GALLERY.push("assets/gallery/g-030.jpg");
GALLERY.push("assets/gallery/g-031.jpg");
GALLERY.push("assets/gallery/g-032.jpg");
GALLERY.push("assets/gallery/g-033.jpg");
GALLERY.push("assets/gallery/g-034.jpg");
GALLERY.push("assets/gallery/g-035.jpg");
GALLERY.push("assets/gallery/g-036.jpg");
GALLERY.push("assets/gallery/g-037.jpg");
GALLERY.push("assets/gallery/g-038.jpg");
GALLERY.push("assets/gallery/g-039.jpg");
GALLERY.push("assets/gallery/g-040.jpg");
GALLERY.push("assets/gallery/g-041.jpg");
GALLERY.push("assets/gallery/g-042.jpg");
GALLERY.push("assets/gallery/g-043.jpg");
GALLERY.push("assets/gallery/g-044.jpg");
const mason = document.getElementById('masonry');
mason.innerHTML = GALLERY.map((src)=>`<div class="masonry-item"><img src="${src}" loading="lazy"></div>`).join('');

// Add-to-calendar
function addCal(city, dateISO, time, titleSuffix) {
  const start = new Date(dateISO + 'T' + time + ':00');
  const startUtc = new Date(start.getTime() - 7*60*60*1000);
  const endUtc = new Date(startUtc.getTime() + 120*60*1000);
  function fmt(d) { const p=n=>String(n).padStart(2,'0'); return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+'00Z'; }
  const url = 'https://www.google.com/calendar/render?action=TEMPLATE' +
              '&text=' + encodeURIComponent('Đám cưới Tiến Đạt & Minh Hằng — ' + titleSuffix + ' (' + city + ')') +
              '&dates=' + encodeURIComponent(fmt(startUtc) + '/' + fmt(endUtc)) +
              '&details=' + encodeURIComponent('Hẹn gặp bạn tại lễ cưới!');
  window.open(url, '_blank');
}
window.addCal = addCal;

function toggleCalMenu(id) {
  const menu = document.getElementById('calmenu-' + id);
  const all = document.querySelectorAll('.cal-menu');
  all.forEach(m => { if (m !== menu) m.classList.remove('open'); });
  menu.classList.toggle('open');
}
window.toggleCalMenu = toggleCalMenu;

document.addEventListener('click', (e)=>{
  const isBtn = e.target.closest && e.target.closest('.icon-btn');
  const isMenu = e.target.closest && e.target.closest('.cal-menu');
  if (!isBtn && !isMenu) document.querySelectorAll('.cal-menu').forEach(m => m.classList.remove('open'));
});



// === Supabase client (expects env.js + supabase-js@2 already included) ===
const supabase = (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON)
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON)
  : null;

// ===== WISHES =====
async function loadWishes() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(r => ({ name: r.name || 'Ẩn danh', status: r.status || 'Chưa rõ', message: r.message || '', ts: r.created_at }));
}

async function insertWish({name, status, message}) {
  if (!supabase) return;
  const { error } = await supabase.from('wishes').insert([{ name, status, message }]);
  if (error) { console.error(error); alert('Gửi thất bại, thử lại giúp mình nhé!'); }
}

// Confetti (light)
function confettiBurst(){
  const cvs = document.getElementById('confetti');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const w = cvs.width = window.innerWidth;
  const h = cvs.height = window.innerHeight;
  const N = 80, parts = [];
  for(let i=0;i<N;i++){
    parts.push({
      x: Math.random()*w, y: h + Math.random()*40,
      vx: (Math.random()-0.5)*1.6, vy: - (2 + Math.random()*3),
      sz: 2 + Math.random()*4, rot: Math.random()*Math.PI, vr: (Math.random()-0.5)*0.2,
      a: 1.0, hue: Math.floor(Math.random()*360)
    });
  }
  let t=0, raf;
  function step(){
    ctx.clearRect(0,0,w,h);
    t+=1;
    for(const p of parts){
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravity
      p.rot += p.vr;
      ctx.globalAlpha = Math.max(0, p.a*(1 - t/120));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${p.hue}, 70%, 55%)`;
      ctx.fillRect(-p.sz/2, -p.sz/2, p.sz, p.sz);
      ctx.restore();
    }
    if (t < 120) raf = requestAnimationFrame(step);
    else { ctx.clearRect(0,0,w,h); cancelAnimationFrame(raf); }
  }
  step();
}

async function renderWishes(){
  const filter = document.getElementById('filter-status').value;
  let list = await loadWishes();
  const counts = {"Tham dự":0,"Không tham dự":0,"Chưa rõ":0};
  list.forEach(x => counts[x.status] = (counts[x.status]||0) + 1);
  document.getElementById('stats').textContent =
    `Tổng: ${list.length} • Tham dự: ${counts["Tham dự"]||0} • Không tham dự: ${counts["Không tham dự"]||0} • Chưa rõ: ${counts["Chưa rõ"]||0}`;
  if (filter !== 'Tất cả'){ list = list.filter(x => x.status === filter); }

  const wrap = document.getElementById('wish-list');
  wrap.innerHTML = list.length ? list.map(w => `
    <div class="wish">
      <div class="row">
        <div class="name">${w.name}</div>
        <span class="badge ${w.status === 'Tham dự' ? 'yes' : (w.status === 'Không tham dự' ? 'no' : 'maybe')}">${w.status}</span>
      </div>
      ${w.message ? `<div class="msg">${w.message.replace(/</g,'&lt;') }</div>` : ''}
      <div class="ts">${new Date(w.ts).toLocaleString('vi-VN')}</div>
    </div>
  `).join('') : '<div class="muted">Chưa có dữ liệu.</div>';
}

document.getElementById('wish-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('wish-name').value.trim() || 'Ẩn danh';
  const status = document.getElementById('wish-status').value;
  const message = document.getElementById('wish-message').value.trim();
  await insertWish({name, status, message});
  e.target.reset();
  confettiBurst();
  renderWishes();
});
document.getElementById('filter-status').addEventListener('change', renderWishes);

// Initial render
renderWishes();


document.addEventListener('DOMContentLoaded', ()=>{
  hookForm();
  render();
});
/* === Hero Contrast (no overlay, mobile-aware) === */
(function(){
  const content = document.querySelector('.hero-content');
  const slides  = document.querySelectorAll('.slide'); // <img class="slide">
  if (!content || !slides.length) return;

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const lum = (r,g,b)=>0.2126*r + 0.7152*g + 0.0722*b;

  function analyze(img){
    c.width = 160; c.height = 90;
    try { ctx.drawImage(img, 0, 0, c.width, c.height); }
    catch { content.classList.remove('on-dark'); return; }
    const d = ctx.getImageData(0, Math.floor(c.height*0.55), c.width, Math.floor(c.height*0.45)).data;
    let sum=0, n=0; for (let i=0;i<d.length;i+=4){ sum += lum(d[i], d[i+1], d[i+2]); n++; }
    const avg = sum/n;
    const MOBILE = matchMedia('(max-width:640px)').matches;
    const threshold = MOBILE ? 140 : 120;  // nhạy hơn trên mobile
    content.classList.toggle('on-dark', avg < threshold);
  }

  function analyzeActive(){
    const active = document.querySelector('.slide.active') || slides[0];
    if (!active) return;
    active.complete ? analyze(active) : active.onload = ()=>analyze(active);
  }

  analyzeActive();
  const obs = new MutationObserver(analyzeActive);
  slides.forEach(sl => obs.observe(sl, {attributes:true, attributeFilter:['class']}));
  addEventListener('resize', analyzeActive, {passive:true});
})();

// === Gift Popup Functions ===
function openGiftPopup() {
  const modal = document.getElementById('gift-modal');
  if (modal) {
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeGiftPopup() {
  const modal = document.getElementById('gift-modal');
  if (modal) {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGiftPopup();
  }
});

window.openGiftPopup = openGiftPopup;
window.closeGiftPopup = closeGiftPopup;

// === Lucky Draw Functions ===
let isDrawing = false;

function openLuckyDraw() {
  const modal = document.getElementById('lucky-draw-modal');
  if (modal) {
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    resetDraw();
  }
}

function closeLuckyDraw() {
  const modal = document.getElementById('lucky-draw-modal');
  if (modal) {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}

function resetDraw() {
  // Reset slots to 0
  document.getElementById('slot1').textContent = '0';
  document.getElementById('slot2').textContent = '0';
  document.getElementById('slot3').textContent = '0';

  // Clear message and winner display
  document.getElementById('lucky-message').textContent = '';
  const winnerDisplay = document.getElementById('winner-display');
  winnerDisplay.classList.remove('show');
  winnerDisplay.innerHTML = '';

  // Reset button
  const btn = document.getElementById('draw-button');
  btn.disabled = false;
  btn.classList.remove('drawing');
  btn.querySelector('.btn-label').textContent = 'Quay số ngay! 🎯';
}

const funnyMessages = [
  "Trống trống trống... 🥁",
  "Ai sẽ trúng nhỉ? 🤔",
  "Thần may mắn đang làm việc... ✨",
  "Chú rể và cô dâu đang cầu nguyện... 🙏",
  "Tình yêu đang xoay vòng... 💘",
  "Nhẫn cưới đang chọn người... 💍",
  "Hoa cưới sắp bay đến ai đó... 💐",
  "Trái tim đang đập thình thịch... 💓"
];

const winnerMessages = [
  { text: "Chúc mừng!", emoji: "🎉" },
  { text: "May mắn quá!", emoji: "🍀" },
  { text: "Trúng to rồi!", emoji: "🎊" },
  { text: "Số phúc của bạn đây!", emoji: "⭐" },
  { text: "Cô dâu chú rể gửi lời chúc!", emoji: "💝" },
  { text: "Người được chọn!", emoji: "👑" },
  { text: "Tình yêu đã chọn bạn!", emoji: "💕" },
  { text: "Nhẫn cưới thuộc về bạn!", emoji: "💍" }
];

function startDraw() {
  if (isDrawing) return;

  isDrawing = true;
  const btn = document.getElementById('draw-button');
  btn.disabled = true;
  btn.classList.add('drawing');
  btn.querySelector('.btn-label').textContent = 'Đang quay... 🎰';

  // Clear previous results
  const winnerDisplay = document.getElementById('winner-display');
  winnerDisplay.classList.remove('show');
  winnerDisplay.innerHTML = '';

  // Show funny message
  const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  document.getElementById('lucky-message').textContent = message;

  // Get slots
  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');

  // Add spinning animation
  slot1.classList.add('spinning');
  slot2.classList.add('spinning');
  slot3.classList.add('spinning');

  // Animate numbers spinning
  let spinCount = 0;
  const maxSpins = 30;
  const spinInterval = setInterval(() => {
    slot1.textContent = Math.floor(Math.random() * 10);
    slot2.textContent = Math.floor(Math.random() * 10);
    slot3.textContent = Math.floor(Math.random() * 10);
    spinCount++;

    if (spinCount >= maxSpins) {
      clearInterval(spinInterval);
      stopDrawAndShowWinner();
    }
  }, 100);
}

function stopDrawAndShowWinner() {
  // Generate final number between 1-250
  const winningNumber = Math.floor(Math.random() * 250) + 1;
  const digits = String(winningNumber).padStart(3, '0').split('');

  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');

  // Stop slot 1
  setTimeout(() => {
    slot1.classList.remove('spinning');
    slot1.classList.add('winning');
    slot1.textContent = digits[0];
    setTimeout(() => slot1.classList.remove('winning'), 1800);
  }, 300);

  // Stop slot 2
  setTimeout(() => {
    slot2.classList.remove('spinning');
    slot2.classList.add('winning');
    slot2.textContent = digits[1];
    setTimeout(() => slot2.classList.remove('winning'), 1800);
  }, 800);

  // Stop slot 3
  setTimeout(() => {
    slot3.classList.remove('spinning');
    slot3.classList.add('winning');
    slot3.textContent = digits[2];
    setTimeout(() => slot3.classList.remove('winning'), 1800);
  }, 1300);

  // Show winner after all slots stop
  setTimeout(() => {
    showWinner(winningNumber);
  }, 1800);
}

function showWinner(number) {
  // Clear message
  document.getElementById('lucky-message').textContent = '';

  // Get random winner message
  const winnerMsg = winnerMessages[Math.floor(Math.random() * winnerMessages.length)];

  // Show winner display
  const winnerDisplay = document.getElementById('winner-display');
  winnerDisplay.innerHTML = `
    <div class="winner-emoji">${winnerMsg.emoji}</div>
    <div class="winner-text">${winnerMsg.text}</div>
    <div class="winner-number">${number}</div>
  `;

  setTimeout(() => {
    winnerDisplay.classList.add('show');
  }, 100);

  // Trigger confetti
  luckyConfetti();

  // Reset button
  const btn = document.getElementById('draw-button');
  btn.classList.remove('drawing');
  btn.disabled = false;
  btn.querySelector('.btn-label').textContent = 'Quay lại! 🔄';

  isDrawing = false;
}

function luckyConfetti() {
  const canvas = document.getElementById('lucky-confetti');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 60; // Reduced from 150
  const emojis = ['💕', '💖', '💍', '🎊', '⭐', '✨'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: 3 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 24 + Math.random() * 16,
      alpha: 1
    });
  }

  let frameCount = 0;
  const maxFrames = 120; // Reduced from 200

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.rotation += p.rotationSpeed;

      // Fade out towards the end
      if (frameCount > maxFrames - 30) {
        p.alpha -= 0.033;
      }

      if (p.alpha > 0 && p.y < canvas.height + 50) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px Arial`;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }
    });

    if (frameCount < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLuckyDraw();
  }
});

window.openLuckyDraw = openLuckyDraw;
window.closeLuckyDraw = closeLuckyDraw;
window.startDraw = startDraw;
