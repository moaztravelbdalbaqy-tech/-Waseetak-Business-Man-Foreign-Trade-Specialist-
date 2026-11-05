(function () {
  'use strict';
  var C = SITE.contacts;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function wa(k, t) { return 'https://wa.me/' + C[k].wa + (t ? '?text=' + encodeURIComponent(t) : ''); }
  function norm(s) { return s.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim(); }
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

  /* أرقام التواصل */
  $$('[data-c]').forEach(function (a) {
    var k = a.getAttribute('data-c'), c = C[k]; if (!c) return;
    var tel = a.getAttribute('data-m') === 'tel';
    a.href = tel ? 'tel:+' + c.wa : wa(k);
    if (!tel) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if (a.hasAttribute('data-show')) { a.textContent = c.display; a.classList.add('num'); }
  });

  /* الأسعار */
  var grid = $('#grid'), q = $('#q'), empty = $('#empty'), sortBtn = $('#sort');
  var mode = 0, modes = [['الترتيب: الافتراضي', 0], ['الترتيب: الأرخص', 1], ['الترتيب: الأغلى', -1]];
  function draw() {
    if (!grid) return;
    var t = norm(q ? q.value : '');
    var list = SITE.prices.filter(function (x) { return norm(x.n).indexOf(t) > -1; });
    if (modes[mode][1]) list = list.slice().sort(function (a, b) { return (a.p - b.p) * modes[mode][1]; });
    grid.innerHTML = list.map(function (x) {
      return '<button type="button" class="price" data-i="' + SITE.prices.indexOf(x) + '"><span>' + x.n + '</span><b>' + x.p + '</b></button>';
    }).join('');
    if (empty) empty.hidden = list.length > 0;
  }
  if (q) q.addEventListener('input', draw);
  if (sortBtn) sortBtn.addEventListener('click', function () {
    mode = (mode + 1) % modes.length; sortBtn.textContent = modes[mode][0]; draw();
  });

  /* نافذة الحجز */
  var dlg = $('#dlg');
  function closeDlg() { if (!dlg) return; if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  if (grid) grid.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.price') : null;
    if (!b || !dlg) return;
    var x = SITE.prices[+b.getAttribute('data-i')];
    $('#dName').textContent = x.n; $('#dPrice').textContent = x.p;
    $('#dWa').href = wa('cairo', 'أريد حجز تذكرة من القاهرة إلى ' + x.n + ' — السعر ' + x.p + ' جنيه مصري');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
    $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', closeDlg); });
  }

  /* الشفرة */
  var cb = $('#copyCode');
  if (cb) cb.addEventListener('click', function () {
    copy(SITE.code, function () { toast('تم النسخ ✅'); });
  });

  /* مشاركة */
  var sh = $('#share');
  if (sh) sh.addEventListener('click', function () {
    var u = location.href;
    if (navigator.share) navigator.share({ title: document.title, url: u }).catch(function () {});
    else copy(u, function () { toast('تم نسخ رابط الموقع ✅'); });
  });

  /* الشركاء والروابط */
  var pe = $('#partners');
  if (pe) pe.innerHTML = SITE.partners.map(function (p) {
    return '<li><span>' + p.n + (p.num ? '<small class="num">' + p.num + '</small>' : '') + '</span></li>';
  }).join('');
  var se = $('#social');
  if (se) se.innerHTML = SITE.links.map(function (l) {
    return '<a href="' + l.u + '" target="_blank" rel="noopener noreferrer">' + l.t + '</a>';
  }).join('');

  /* تمييز القسم الحالي في القائمة */
  if ('IntersectionObserver' in window) {
    var links = $$('.nav a[href^="#"]');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) io.observe(s); });
  }
  draw();
})();
