
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


// === Supabase-backed RSVP & Wishes ===

// Requires env.js and @supabase/supabase-js
if (!window.SUPABASE_URL || !window.SUPABASE_ANON || !window.supabase) {
  console.warn("Supabase env not found. Please include env.js and supabase-js@2.");
}

const supabase = window.supabase ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON) : null;

async function loadAll() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(r => ({
    name: r.name || 'Ẩn danh',
    status: r.status || 'Chưa rõ',
    message: r.message || '',
    ts: r.created_at
  }));
}

async function insertWish({name, status, message}) {
  if (!supabase) return;
  const { error } = await supabase.from('wishes').insert([{ name, status, message }]);
  if (error) { console.error(error); alert('Gửi thất bại, thử lại giúp mình nhé!'); }
}

async function render(){
  const filterEl = document.getElementById('filter-status');
  const wrap = document.getElementById('wish-list');
  const statsEl = document.getElementById('stats');
  if (!wrap || !statsEl || !filterEl) return;

  const filter = filterEl.value;
  let list = await loadAll();
  const counts = {"Tham dự":0,"Không tham dự":0,"Chưa rõ":0};
  list.forEach(x => counts[x.status] = (counts[x.status]||0) + 1);
  statsEl.textContent = `Tổng: ${list.length} • Tham dự: ${counts["Tham dự"]||0} • Không tham dự: ${counts["Không tham dự"]||0} • Chưa rõ: ${counts["Chưa rõ"]||0}`;

  if (filter !== 'Tất cả'){ list = list.filter(x => x.status === filter); }
  wrap.innerHTML = list.length ? list.map(w => `
    <div class="wish">
      <div class="row">
        <div class="name">${w.name}</div>
        <span class="badge ${w.status === 'Tham dự' ? 'yes' : (w.status === 'Không tham dự' ? 'no' : 'maybe')}">${w.status}</span>
      </div>
      ${w.message ? `<div class="msg">${w.message}</div>` : ''}
      <div class="ts">${new Date(w.ts).toLocaleString('vi-VN')}</div>
    </div>
  `).join('') : '<div class="muted">Chưa có dữ liệu.</div>';
}

function hookForm(){
  const form = document.getElementById('wish-form');
  const filter = document.getElementById('filter-status');
  const btnExport = document.getElementById('btn-export');
  const btnClear = document.getElementById('btn-clear');
  if (!form) return;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('wish-name').value.trim() || 'Ẩn danh';
    const status = document.getElementById('wish-status').value;
    const message = document.getElementById('wish-message').value.trim();
    await insertWish({name, status, message});
    e.target.reset();
    render();
  });

  if (filter) filter.addEventListener('change', render);

  if (btnExport) btnExport.addEventListener('click', async (e)=>{
    e.preventDefault();
    const list = await loadAll();
    const header = ['ten','trang_thai','loi_chuc','timestamp'];
    const rows = list.map(w => [w.name, w.status, (w.message||'').replace(/\\n/g,' ').replace(/"/g,'""'), w.ts]);
    const csv = [header.join(','), ...rows.map(r => r.map(x => `"${x}"`).join(','))].join('\\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'khach-moi.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  if (btnClear) btnClear.addEventListener('click', (e)=>{
    e.preventDefault();
    alert('Danh sách đang lưu trên server — không xoá tại đây để tránh mất dữ liệu.');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  hookForm();
  render();
});
