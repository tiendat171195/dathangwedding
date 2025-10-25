
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

// RSVP + Wishes
const KEY='wishes_v2';
function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function counts(list){
  const total = list.length;
  const by = {"Tham dự":0,"Không tham dự":0,"Chưa rõ":0};
  list.forEach(x => by[x.status] = (by[x.status]||0) + 1);
  return {total, by};
}
function render(){
  const filter = document.getElementById('filter-status').value;
  let list = load();
  const c = counts(list);
  document.getElementById('stats').textContent =
    `Tổng: ${c.total} • Tham dự: ${c.by["Tham dự"]} • Không tham dự: ${c.by["Không tham dự"]} • Chưa rõ: ${c.by["Chưa rõ"]}`;
  if (filter !== 'Tất cả'){ list = list.filter(x => x.status === filter); }
  const wrap = document.getElementById('wish-list');
  if (!list.length){ wrap.innerHTML = '<div class="muted">Chưa có dữ liệu.</div>'; return; }
  wrap.innerHTML = list.map(w => `
    <div class="wish">
      <div class="row">
        <div class="name">${w.name}</div>
        <span class="badge ${w.status === 'Tham dự' ? 'yes' : (w.status === 'Không tham dự' ? 'no' : 'maybe')}">${w.status}</span>
      </div>
      ${w.message ? `<div class="msg">${w.message}</div>` : ''}
      <div class="ts">${new Date(w.ts).toLocaleString('vi-VN')}</div>
    </div>
  `).join('');
}
document.getElementById('wish-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('wish-name').value.trim() || 'Ẩn danh';
  const status = document.getElementById('wish-status').value;
  const message = document.getElementById('wish-message').value.trim();
  if (!status) return;
  const list = load();
  list.unshift({name, status, message, ts: Date.now()});
  save(list.slice(0, 2000));
  e.target.reset();
  render();
});
document.getElementById('filter-status').addEventListener('change', render);
document.getElementById('btn-export').addEventListener('click', (e)=>{ e.preventDefault(); 
  const list = load();
  const header = ['ten','trang_thai','loi_chuc','timestamp'];
  const rows = list.map(w => [w.name, w.status, (w.message||'').replace(/\n/g,' ').replace(/"/g,'""'), new Date(w.ts).toISOString()]);
  const csv = [header.join(','), ...rows.map(r => r.map(x => `"${x}"`).join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'khach-moi.csv'; a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('btn-clear').addEventListener('click', (e)=>{ e.preventDefault();
  if(confirm('Xoá toàn bộ danh sách?')){ localStorage.removeItem(KEY); render(); }
});
render();


/* === merged hero contrast patch === */

/* === Hero Contrast Patch JS ===
   Measures brightness in the lower third (where hero-content sits),
   toggles .on-dark on .hero-content for better legibility.
*/
(function(){
  const content = document.querySelector('.hero-content');
  const slides = document.querySelectorAll('.slide');
  if(!content || !slides.length) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function luminance(r,g,b){ // simple relative luminance approximation
    return 0.2126*r + 0.7152*g + 0.0722*b;
  }

  function analyze(img){
    // Sample a strip at the bottom 35% of the image (where text block is)
    const w = canvas.width = 160;  // small downscale for speed
    const h = canvas.height = 90;
    try {
      ctx.drawImage(img, 0, 0, w, h);
    } catch(e){
      content.classList.remove('on-dark');
      return;
    }
    const data = ctx.getImageData(0, Math.floor(h*0.55), w, Math.floor(h*0.45)).data;
    let sum = 0, count = 0;
    for(let i=0;i<data.length;i+=4){
      const r=data[i], g=data[i+1], b=data[i+2];
      sum += luminance(r,g,b);
      count++;
    }
    const avg = sum / count; // 0..255
    if(avg < 120){
      content.classList.add('on-dark');
    }else{
      content.classList.remove('on-dark');
    }
  }

  function analyzeActive(){
    const active = document.querySelector('.slide.active');
    if(!active) return;
    if(active.complete){
      analyze(active);
    }else{
      active.onload = ()=>analyze(active);
    }
  }

  // Hook into existing slideshow if present
  analyzeActive();
  // Re-check when slide changes (observes class changes)
  const obs = new MutationObserver(analyzeActive);
  slides.forEach(sl=>obs.observe(sl, { attributes:true, attributeFilter:['class'] }));
})();
