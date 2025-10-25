
// Countdown to nearest event (ceremony preferred, else reception)
(function(){
  const EVENTS = [
    { city: "Quảng Ninh", dateISO: "2025-11-02", time: { reception: "10:30", ceremony: "11:00" } },
    { city: "Bình Dương", dateISO: "2025-11-15", time: { reception: "11:00", ceremony: "11:30" } },
    { city: "Q7, TP. HCM", dateISO: "2025-11-23", time: { reception: "18:00", ceremony: "19:00" } },
  ];

  function pickTarget(ev){
    // Prefer ceremony if present, else reception
    const t = (ev.time && ev.time.ceremony) ? ev.time.ceremony : (ev.time && ev.time.reception ? ev.time.reception : "00:00");
    return new Date(ev.dateISO + "T" + t + ":00");
  }

  function nearestEvent(){
    const now = new Date();
    const list = EVENTS.map(e => ({ ...e, target: pickTarget(e) })).sort((a,b)=>a.target-b.target);
    return list.find(e => e.target >= now) || list[list.length - 1];
  }

  function fmtParts(ms){
    const s = Math.max(0, Math.floor(ms/1000));
    const d = Math.floor(s/86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return { d, h, m, s: sec };
  }

  function render(){
    const el = document.getElementById("countdown");
    if (!el) return;
    const ev = nearestEvent();
    const diff = ev.target.getTime() - Date.now();
    const {d,h,m,s} = fmtParts(diff);
    const pretty = new Intl.DateTimeFormat("vi-VN", {weekday:"long", day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"}).format(ev.target);
    el.innerHTML = [
      '<div class="count-prefix">Sự kiện gần nhất: <span class="badge">', ev.city, '</span> — ', pretty, '</div>',
      '<div class="count-tiles">',
        '<div class="tile"><div class="n">', String(d).padStart(2,'0'), '</div><div class="l">Ngày</div></div>',
        '<div class="tile"><div class="n">', String(h).padStart(2,'0'), '</div><div class="l">Giờ</div></div>',
        '<div class="tile"><div class="n">', String(m).padStart(2,'0'), '</div><div class="l">Phút</div></div>',
        '<div class="tile"><div class="n">', String(s).padStart(2,'0'), '</div><div class="l">Giây</div></div>',
      '</div>'
    ].join('');
  }

  render();
  setInterval(render, 1000);
})();
