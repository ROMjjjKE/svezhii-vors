/* СВЕЖИЙ ВОРС: меню, конфигуратор, пятна, заявка */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TEL = '375256130443';

  /* меню */
  var drawer = $('#drawer'), burger = $('.burger');
  function openD() {
    if (!drawer) return;
    drawer.hidden = false; document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a, button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true; document.body.classList.remove('is-locked');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
  }
  if (burger) burger.addEventListener('click', function () { drawer.hidden ? openD() : closeD(); });
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer || e.target.hasAttribute('data-close')) closeD(); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a, button', drawer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeD(); });

  /* конфигуратор */
  var cfg = $('[data-cfg]');
  if (cfg) {
    var ITEMS = {
      sofa1: ['Диван прямой', 60, 90], sofaU: ['Диван угловой', 90, 120], sofaP: ['Диван П-образный', 120, 150],
      chair: ['Кресло', 30, 40], puff: ['Пуф', 15, 20], corner: ['Кухонный уголок', 60, 90],
      mat1: ['Матрас, одна сторона', 30, 40], mat2: ['Матрас, две стороны', 50, 70], head: ['Изголовье кровати', 20, 30],
      rug: ['Ковёр', 10, 15], carpet: ['Ковролин', 10, 15], auto: ['Салон авто', 90, 120]
    };
    var state = {};
    function hm(m) {
      var h = Math.floor(m / 60), r = Math.round(m % 60);
      return h ? (r ? h + ' ч ' + r + ' мин' : h + ' ч') : r + ' мин';
    }
    function render() {
      var count = 0, lo = 0, hi = 0, names = [], needPower = false, needSpace = false;
      Object.keys(state).forEach(function (k) {
        var n = state[k]; if (!n) return;
        var it = ITEMS[k];
        count += n; lo += it[1] * n; hi += it[2] * n;
        names.push(it[0] + (k === 'rug' || k === 'carpet' ? ' ' + n + ' м²' : ' ×' + n));
        if (k === 'auto') needPower = true; else needSpace = true;
      });
      lo = Math.floor(lo / 15) * 15; hi = Math.ceil(hi / 15) * 15;
      var h = $('[data-out-h]', cfg), t = $('[data-out-time]', cfg), c = $('[data-out-count]', cfg),
          nd = $('[data-out-need]', cfg), wa = $('[data-out-wa]', cfg);
      if (!count) {
        h.textContent = 'Выберите предметы';
        t.textContent = '—'; c.textContent = '0';
        nd.textContent = 'Отметьте, что нужно почистить: посчитаем время и скажем, что подготовить.';
        wa.href = 'https://wa.me/' + TEL;
        return;
      }
      h.textContent = '≈ ' + hm(lo) + ' – ' + hm(hi);
      t.textContent = hm(lo) + ' – ' + hm(hi);
      c.textContent = count;
      var needs = ['Розетка 220 В рядом с предметом'];
      if (needSpace) needs.push('Свободный подход к мебели');
      needs.push('Место для сушки на 4–8 часов');
      nd.textContent = needs.join(' · ') + '.';
      wa.href = 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(
        'Здравствуйте! Нужна химчистка: ' + names.join(', ') + '. Ориентир по времени: ' + hm(lo) + '–' + hm(hi) + '. Город: Могилёв. Когда сможете приехать?');
    }
    cfg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      var k = b.getAttribute('data-k'), d = +b.getAttribute('data-step');
      state[k] = Math.max(0, Math.min(20, (state[k] || 0) + d));
      var v = cfg.querySelector('[data-v="' + k + '"]'); if (v) v.textContent = state[k];
      render();
    });
    render();
  }

  /* пятна */
  var st = $('[data-stains]');
  if (st) {
    var chips = $$('.chip', st), cards = $$('[data-sd]', st);
    function pick(k) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-stain') === k ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = c.getAttribute('data-sd') !== k; });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-stain')); }); });
    if (chips[0]) pick(chips[0].getAttribute('data-stain'));
  }

  /* заявка */
  $$('[data-lead]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var txt = 'Заявка с сайта СВЕЖИЙ ВОРС\nИмя: ' + (d.get('name') || '') + '\nТелефон: ' + (d.get('phone') || '') +
        '\nЧто чистим: ' + (d.get('what') || '') + '\nАдрес: ' + (d.get('addr') || '') + '\nКомментарий: ' + (d.get('msg') || '');
      window.open('https://wa.me/' + TEL + '?text=' + encodeURIComponent(txt), '_blank');
    });
  });
})();
