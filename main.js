
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
