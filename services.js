(function () {
  'use strict';
  var S = (typeof SITE !== 'undefined') ? SITE : { contacts: {}, prices: [], partners: [], links: [], code: 'أنا من طرف وسيطك 😎👑💪' };
  var C = S.contacts || {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function wa(k, t) { return C[k] ? 'https://wa.me/' + C[k].wa + (t ? '?text=' + encodeURIComponent(t) : '') : '#'; }
  var toastEl = $('#toast'), tt;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }
  function copy(t, ok) {
    function fb() {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast('انسخ يدويًا: ' + t); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(ok, fb); else fb();
  }
  function cb(k) {
    var c = C[k]; if (!c) return '';
    return '<span class="cb"><a class="b wa" href="' + wa(k) + '" target="_blank" rel="noopener noreferrer"><span class="num">' + c.display + '</span></a>' +
      '<a class="b tel" href="tel:+' + c.wa + '" aria-label="اتصال بالرقم ' + c.display + '">📞</a></span>';
  }

  /* أزرار ثابتة في الصفحة */
  $$('[data-c]').forEach(function (a) {
    var k = a.getAttribute('data-c'); if (!C[k]) return;
    var tel = a.getAttribute('data-m') === 'tel';
    a.href = tel ? 'tel:+' + C[k].wa : wa(k);
    if (!tel) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if (a.hasAttribute('data-show')) { a.textContent = C[k].display; a.classList.add('num'); }
  });

  /* الخدمات */
  var bento = $('#bento'), chips = $('#chips');
  function card(it) {
    var cat = SVC.cats[it.cat], id = 'd-' + it.id, det = '';
    if (it.req) det += '<p class="k">المتطلبات:</p><ul>' + it.req.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>';
    if (it.note) det += '<p dir="ltr">' + it.note + '</p>';
    if (it.addr) det += '<p>📍 ' + it.addr + '</p><a class="b" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(it.addr) + '" target="_blank" rel="noopener noreferrer">افتح الموقع على الخريطة</a>';
    if (it.link) det += '<a class="b" href="' + it.link.u + '" target="_blank" rel="noopener noreferrer"><span dir="ltr">' + it.link.t + '</span></a>';
    if (it.go) det += '<a class="b" href="' + it.go + '">اعرف سعر تذكرتك</a>';
    if (it.c) det += '<div class="cbs">' + it.c.map(cb).join('') + '</div>';
    return '<article class="card' + (it.big ? ' l' : '') + '" data-cat="' + it.cat + '" style="--c:' + cat.c + '">' +
      '<span class="ico" aria-hidden="true">' + it.ico + '</span>' +
      (it.badge ? '<span class="badge">' + it.badge + '</span>' : '') +
      '<h3>' + it.t + '</h3>' +
      (it.price ? '<p class="pr"><b>' + it.price + '</b> ' + it.unit + '</p>' : '') +
      '<p class="d">' + it.d + '</p>' +
      '<button class="more" type="button" aria-expanded="false" aria-controls="' + id + '">تفاصيل</button>' +
      '<div class="det" id="' + id + '" hidden>' + det + '</div></article>';
  }
  if (bento) {
    bento.innerHTML = SVC.items.map(card).join('');
    bento.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.more') : null; if (!b) return;
      var p = document.getElementById(b.getAttribute('aria-controls')), open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open)); b.textContent = open ? 'تفاصيل' : 'إخفاء';
      if (p) p.hidden = open;
    });
  }
  if (chips) {
    var cs = [['all', 'الكل', '#D4AF37']].concat(Object.keys(SVC.cats).map(function (k) { return [k, SVC.cats[k].t, SVC.cats[k].c]; }));
    chips.innerHTML = cs.map(function (c, i) {
      return '<button type="button" class="chip" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '" style="--c:' + c[2] + '">' + c[1] + '</button>';
    }).join('');
    chips.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.chip') : null; if (!b) return;
      var f = b.getAttribute('data-f');
      $$('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.card', bento).forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.hidden = !show;
        if (show) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
      });
    });
  }

  /* الفروع */
  var tabs = $('#tabs'), tp = $('#tabpanel');
  function showTab(i) {
    var bs = $$('.tab', tabs), br = SVC.branches[i];
    bs.forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    tp.innerHTML = (br.sub ? '<p class="muted">' + br.sub + '</p>' : '') + br.lines.map(function (l) {
      return '<div class="line"><p>' + l.t + '</p>' + cb(l.k) + '</div>';
    }).join('');
  }
  if (tabs && tp) {
    tabs.innerHTML = SVC.branches.map(function (b) { return '<button type="button" role="tab" class="tab">' + b.t + '</button>'; }).join('');
    tabs.addEventListener('click', function (e) {
      var i = $$('.tab', tabs).indexOf(e.target.closest ? e.target.closest('.tab') : null); if (i > -1) showTab(i);
    });
    tabs.addEventListener('keydown', function (e) {
      var n = SVC.branches.length, bs = $$('.tab', tabs), cur = bs.indexOf(document.activeElement), i = -1;
      if (cur < 0) return;
      if (e.key === 'ArrowLeft') i = (cur + 1) % n; else if (e.key === 'ArrowRight') i = (cur - 1 + n) % n;
      if (i > -1) { e.preventDefault(); showTab(i); bs[i].focus(); }
    });
    showTab(0);
  }

  /* اعرف سعر تذكرتك */
  var dest = $('#dest'), res = $('#res');
  if (dest && res) {
    dest.innerHTML = '<option value="">اختر الوجهة…</option>' + S.prices.map(function (x, i) { return '<option value="' + i + '">' + x.n + '</option>'; }).join('');
    dest.addEventListener('change', function () {
      if (dest.value === '') { res.hidden = true; return; }
      var x = S.prices[+dest.value];
      $('#rName').textContent = x.n; $('#rPrice').textContent = x.p;
      $('#rWa').href = wa('cairo', 'أريد حجز تذكرة من القاهرة إلى ' + x.n + ' — السعر ' + x.p + ' جنيه مصري');
      res.hidden = false;
    });
  }

  /* الشركاء والروابط والشفرة */
  var pe = $('#partners');
  if (pe) pe.innerHTML = S.partners.map(function (p) {
    return '<li><span>' + p.n + (p.num ? '<small class="num">' + p.num + '</small>' : '') + '</span></li>';
  }).join('');
  var se = $('#social');
  if (se) se.innerHTML = S.links.concat([SVC.channel]).map(function (l) {
    return '<a href="' + l.u + '" target="_blank" rel="noopener noreferrer">' + l.t + '</a>';
  }).join('');
  var cc = $('#copyCode');
  if (cc) cc.addEventListener('click', function () { copy(S.code, function () { toast('تم النسخ ✅'); }); });
})();
