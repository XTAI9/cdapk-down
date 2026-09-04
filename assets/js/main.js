/* ==========================================================================
 *  Cloudreve Android · 官网渲染引擎（零依赖 Vanilla JS）
 *  - 从 config.js 读取全部内容并渲染（双语）
 *  - Liquid Glass 引擎：
 *      1) Luma 感知着色：采样页面背景渐变与光斑，为每块玻璃实时计算背景色
 *      2) 实时光照：指针=全局光源 → 边缘收光 / 表面漫反射 / 滚动流光 / 触点涟漪 / 透镜按压
 *      3) 折射投影：场景副本放大重投影进玻璃内部，滚动迟缓 + 纵向形变
 *      4) 一镜到底：滚动驱动动画（cr-sd，原生 animation-timeline），
 *         不支持/减弱动效时回退 IntersectionObserver 逐项显现
 *  - 主题 / 语言切换（localStorage 记忆，默认跟随系统）
 * ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var I18N = CFG.i18n || {};
  var LANG_KEPT = "crweb-lang";
  var THEME_KEPT = "crweb-theme";

  /* ---------------- 能力探测（首帧前执行） ---------------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var crSdSupported = false;
  try { crSdSupported = !!(window.CSS && CSS.supports("animation-timeline: view()")); } catch (e) { crSdSupported = false; }
  if (crSdSupported && !reduceMotion) document.documentElement.classList.add("cr-sd");
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) document.documentElement.classList.add("lg-pt");

  /* ---------------- 主题：首次绘制前应用，避免闪烁 ---------------- */
  var keptTheme = localStorage.getItem(THEME_KEPT);
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute(
    "data-theme",
    keptTheme === "dark" || keptTheme === "light" ? keptTheme : (systemDark ? "dark" : "light")
  );

  /* ---------------- 工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function lang() { return document.documentElement.getAttribute("data-lang") || "zh"; }
  function t(key) {
    var map = I18N[lang()] || {};
    var s = map[key];
    if (s === undefined) s = (I18N.zh || {})[key] || key;
    return String(s);
  }
  function pick(obj) {
    if (obj === undefined || obj === null) return "";
    if (typeof obj === "string") return obj;
    if (obj[lang()] !== undefined) return obj[lang()];
    if (obj.zh !== undefined) return obj.zh;
    return "";
  }
  function siteStr(name) {
    var v = String(pick(CFG.site[name]) || "");
    return v.replace(/\{version\}/g, String(CFG.version.current));
  }
  function detectLang() {
    var kept = localStorage.getItem(LANG_KEPT);
    if (kept === "zh" || kept === "en") return kept;
    return (navigator.language || "zh").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }
  /* 元素进入视口的起始偏移（滚动编排错落量，用于 --cr-so） */
  function stagger(n, base, step) { return (n % base) * step; }

  /* ---------------- 语言 ---------------- */
  function applyLang(l) {
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.setAttribute("lang", l === "zh" ? "zh-CN" : "en");
    localStorage.setItem(LANG_KEPT, l);
    $all("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $all("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.title = siteStr("pageTitle") || siteStr("title");
    var btn = $("#lang-btn");
    if (btn) btn.innerHTML = '<span class="lang-code">' + (l === "zh" ? "EN" : "中") + "</span>";
    renderAll();
  }

  /* ---------------- 主题 ---------------- */
  function theme() { return document.documentElement.getAttribute("data-theme") || "light"; }

  function applyTheme(mode) {
    if (mode === "system") {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      localStorage.removeItem(THEME_KEPT);
    } else {
      localStorage.setItem(THEME_KEPT, mode);
    }
    document.documentElement.setAttribute("data-theme", mode);
    renderThemeBtn();
    scheduleGlasses();
  }

  function renderThemeBtn() {
    var btn = $("#theme-btn");
    if (!btn) return;
    var dark = theme() === "dark";
    btn.innerHTML = svg(dark ? "sun" : "moon");
    btn.setAttribute("aria-label", dark ? t("a11y.light") : t("a11y.dark"));
  }

  /* ---------------- 图标 ---------------- */
  var ICONS = {
    "user-switch": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    "refresh": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    magnet: '<path d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15"/><path d="m5 8 4 4"/><path d="m12 15 4 4"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    github: '<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
  };

  function svg(name, cls) {
    var body = ICONS[name] || "";
    var attrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if (cls) attrs += ' class="' + cls + '"';
    return '<svg ' + attrs + ">" + body + "</svg>";
  }

  /* ==================================================================
   * Liquid Glass 引擎
   * ================================================================== */

  /* --- 深层液体玻璃引擎：Luma 着色 + 折射投影 + 亮度调制 + 磁吸 --- */
  /* SCENE = 页面场景（背景渐变 + 4 个光斑），JS 采样它为玻璃取色、并把
     "背后画面"重投影进每块玻璃内部（::before 折射层） */
  var SCENE = { angle: 160, stops: [], orbs: [] };
  var glassRaf = 0;
  var parallaxDx = 0, parallaxDy = 0;   // 视差循环共享位移（折射层同步跟随）
  var REFR_M = 1.06;                    // 折射放大率：玻璃里的世界比外面"大"一点
  var MAG_CARDS = [];                   // 磁吸目标缓存（.feature-card）
  var scrollVel = 0, scrollPrev = 0;    // 滚动速度（驱动玻璃"液态迟缓"）
  var flowLag = 0;                      // 折射场景阻尼滞后量

  function parseCssColor(s) {
    if (!s) return null;
    s = String(s).trim();
    var m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(s);
    if (m) return [+m[1], +m[2], +m[3]];
    m = /#([0-9a-f]{6})/i.exec(s);
    if (m) { var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    return null;
  }

  function parseGradient(g) {
    var angle = 160, stops = [];
    var m = /linear-gradient\(\s*(-?[\d.]+)deg\s*,(.+)\)\s*$/i.exec(g);
    if (m) {
      angle = parseFloat(m[1]);
      var body = m[2];
      var parts = [];
      var depth = 0, cur = "";
      for (var i = 0; i < body.length; i++) {
        var ch = body[i];
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        if (ch === "," && depth === 0) { parts.push(cur); cur = ""; }
        else cur += ch;
      }
      if (cur.trim()) parts.push(cur);
      parts.forEach(function (p) {
        var mm = /^(.*?)\s+(-?[\d.]+)%$/.exec(p.trim());
        if (mm) {
          var c = parseCssColor(mm[1]);
          if (c) stops.push({ t: parseFloat(mm[2]) / 100, c: c });
        }
      });
    }
    return { angle: angle, stops: stops };
  }

  function sampleGradient(x, y, w, h) {
    if (!SCENE.stops.length) return [238, 241, 255];
    var rad = SCENE.angle * Math.PI / 180;
    var dx = Math.sin(rad), dy = -Math.cos(rad);
    var len = Math.abs(w * dx) + Math.abs(h * dy) || 1;
    var cx = x + w / 2, cy = y + h / 2;
    var s = ((cx - (cx - dx * len / 2)) * dx + (cy - (cy - dy * len / 2)) * dy) / len;
    var stops = SCENE.stops;
    var a = stops[0], b = stops[stops.length - 1];
    for (var i = 0; i < stops.length - 1; i++) {
      if (s >= stops[i].t && s <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; }
    }
    var f = Math.min(1, Math.max(0, (s - a.t) / ((b.t - a.t) || 1)));
    return [
      Math.round(a.c[0] + (b.c[0] - a.c[0]) * f),
      Math.round(a.c[1] + (b.c[1] - a.c[1]) * f),
      Math.round(a.c[2] + (b.c[2] - a.c[2]) * f)
    ];
  }

  function blendTint(base, orbs) {
    var out = base.slice();
    orbs.forEach(function (o) {
      if (!o.c) return;
      var k = o.s * (theme() === "dark" ? 0.5 : 0.75);
      if (k <= 0) return;
      out[0] = out[0] + (o.c[0] - out[0]) * k;
      out[1] = out[1] + (o.c[1] - out[1]) * k;
      out[2] = out[2] + (o.c[2] - out[2]) * k;
    });
    return out.map(function (v) { return Math.round(v); });
  }

  /* ==================================================================
     实时光照引擎：指针 = 全局光源，每帧为每块玻璃结算——
     · 边缘收光（--rl-*）：光源在玻璃边框最靠近指针处集合，
       强度随距离衰减（"手即灯光"，远近画面同时响应）
     · 表面漫反射（--sp-*）：跟随指针；指针缺失时停滞漂移
       （"液态呼吸"）；滚动速度拉出流光拖尾，停止后滑行
     · 触点涟漪（--tap-*）：点击玻璃，该点迸发一圈衰减光晕
     · 透镜按压（hovered）：指针所在玻璃折射放大并微倾（光压）
   ================================================================== */
  var GLASSES = [];          // 可视玻璃快照 {el,x1,y1,w,h}
  var LIGHT = { x: -9999, y: -9999, has: false };
  var tapRipples = [];
  var lightRaf = 0, lastTick = 0;
  var prevHover = null;      // 上一个被"按压"的玻璃（离开后折射回弹）

  function refreshGlassRects() {
    var vh = window.innerHeight, vw = window.innerWidth;
    GLASSES = [];
    $all(".glass").forEach(function (el) {
      var b = el.getBoundingClientRect();
      if (b.bottom < 0 || b.top > vh || b.right < 0 || b.left > vw) return;
      GLASSES.push({ el: el, x1: b.left, y1: b.top, w: b.width, h: b.height });
    });
    startLight();
  }

  /* 折射投影序列（每层：渐变 0 0 → 各光斑窗口坐标） */
  function projectPos(g, ox, oy, m) {
    var p = "0 0";
    for (var i = 0; i < SCENE.orbs.length; i++) {
      var o = SCENE.orbs[i];
      p += ", " + Math.round(ox + parallaxDx * m) + "px " + Math.round(oy + parallaxDy * m) + "px";
    }
    return p;
  }
  function projectSize(g, m) {
    var s = Math.round(m * 100) + "% " + Math.round(m * 100) + "%";
    for (var i = 0; i < SCENE.orbs.length; i++) {
      var o = SCENE.orbs[i];
      s += ", " + Math.round(o.r * 2 * m) + "px " + Math.round(o.r * 2 * m) + "px";
    }
    return s;
  }

  function lightTick(now) {
    lightRaf = 0;
    if (!GLASSES.length || document.hidden) return;
    if (now - lastTick < 22) { lightRaf = requestAnimationFrame(lightTick); return; }
    lastTick = now;
    var t = now / 1000;
    var dark = theme() === "dark";
    var mx = LIGHT.x, my = LIGHT.y, has = LIGHT.has;

    /* 停滞时的液态呼吸：光斑在表面缓慢游走（指针缺失时接管） */
    var driftX = 16 + Math.sin(t * 0.33) * 11;
    var driftY = -9 + Math.sin(t * 0.27 + 1.7) * 13;

    /* 滚动流光：速度拉出拖尾，停止后缓速滑行（液态惯性） */
    if (!reduceMotion) scrollVel += (0 - scrollVel) * 0.2;
    var streak = scrollVel * 0.02;

    var hovered = null;
    for (var i = 0; i < GLASSES.length; i++) {
      var g = GLASSES[i];
      var cx = g.x1 + g.w / 2, cy = g.y1 + g.h / 2;
      var dx = (mx - cx) / Math.max(g.w / 2, 1);
      var dy = (my - cy) / Math.max(g.h / 2, 1);
      var fall = has ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 4.2) : 0;
      var px = mx - g.x1, py = my - g.y1;
      var on = has && px > 0 && py > 0 && px < g.w && py < g.h;

      /* 边缘收光：光源落点被推向最靠近指针的边框 */
      g.el.style.setProperty("--rl-a", ((dark ? 0.24 : 0.5) + fall * 0.5).toFixed(3));
      g.el.style.setProperty("--rl-x", (4 + Math.min(92, Math.max(4, (px / g.w) * 100))).toFixed(1) + "%");
      g.el.style.setProperty("--rl-y", (-6 + Math.min(74, Math.max(-6, (py / g.h) * 100))).toFixed(1) + "%");

      /* 表面漫反射 + 彩色漫反射（指针 / 漂移 / 滚动拖尾） */
      g.el.style.setProperty("--sp-a", (0.16 + fall * 0.3).toFixed(3));
      g.el.style.setProperty("--sp-x", (has ? px / g.w * 100 : driftX).toFixed(1) + "%");
      g.el.style.setProperty("--sp-y", ((has ? py / g.h * 100 : driftY) + streak).toFixed(1) + "%");

      /* 透镜按压：指针悬停的玻璃折射加强并向光源微倾（光压） */
      if (on) {
        var m = REFR_M * 1.09;
        var ox = cx * (1 - m) - g.x1 + (mx - cx) * 0.035;
        var oy = cy * (1 - m) - g.y1 + (my - cy) * 0.035;
        g.el.style.setProperty("--refr-pos", projectPos(g, ox, oy, m));
        g.el.style.setProperty("--refr-size", projectSize(g, m));
        hovered = g;
      }
    }
    /* 指针离开玻璃后，折射回弹到常规投影 */
    if (hovered !== prevHover) {
      if (prevHover) {
        var m0 = REFR_M;
        var pcx = prevHover.x1 + prevHover.w / 2, pcy = prevHover.y1 + prevHover.h / 2;
        var ox0 = pcx * (1 - m0) - prevHover.x1;
        var oy0 = pcy * (1 - m0) - prevHover.y1 + flowLag * 0.6 * m0;
        prevHover.el.style.setProperty("--refr-pos", projectPos(prevHover, ox0, oy0, m0));
        prevHover.el.style.setProperty("--refr-size", projectSize(prevHover, m0));
      }
      prevHover = hovered;
    }
    if (tapRipples.length) tickRipples();
    lightRaf = requestAnimationFrame(lightTick);
  }

  function startLight() {
    if (reduceMotion || lightRaf || !GLASSES.length) return;
    lightRaf = requestAnimationFrame(lightTick);
  }

  /* --- 触点涟漪：点击玻璃时，该点迸发一圈衰减光晕 --- */
  function addRipple(el, x, y) {
    tapRipples.push({ el: el, x: x, y: y, t0: performance.now() });
    el.style.setProperty("--tap-x", x + "%");
    el.style.setProperty("--tap-y", y + "%");
  }
  function tickRipples() {
    var now = performance.now();
    for (var i = tapRipples.length - 1; i >= 0; i--) {
      var r = tapRipples[i];
      var p = (now - r.t0) / 850;
      if (p >= 1) {
        r.el.style.setProperty("--tap-a", "0");
        tapRipples.splice(i, 1);
      } else {
        var e = 1 - Math.pow(1 - p, 3);
        r.el.style.setProperty("--tap-a", (0.9 * (1 - e)).toFixed(3));
      }
    }
  }

  /* --- 玻璃全局结算：采样着色 / 亮度调制 / 折射投影（滚动驱动） --- */
  function updateGlasses() {
    glassRaf = 0;
    if (!SCENE.orbs.length) return;
    var dark = theme() === "dark";
    if (!reduceMotion) flowLag += (scrollVel - flowLag) * 0.3;   /* 液态迟缓阻尼 */
    var lag = flowLag * 0.6 * REFR_M;
    var spd = Math.min(26, Math.abs(scrollVel));
    refreshGlassRects();
    for (var k = 0; k < GLASSES.length; k++) {
      var g = GLASSES[k];
      var cx = g.x1 + g.w / 2, cy = g.y1 + g.h / 2;

      /* ① 着色：背景采样 + 邻近光斑（玻色取决它"看到"什么） */
      var base = sampleGradient(g.x1, g.y1, g.w, g.h);
      var ctx = [];
      SCENE.orbs.forEach(function (o) {
        var d = Math.sqrt((cx - o.x) * (cx - o.x) + (cy - o.y) * (cy - o.y));
        ctx.push({ c: o.c, s: Math.max(0, 1 - d / (o.r * 1.55)) });
      });
      var out = blendTint(base, ctx);
      var tint = out[0] + ", " + out[1] + ", " + out[2];
      g.el.style.setProperty("--lg-t", tint);
      g.el.style.setProperty("--spec-tint", tint);

      /* ② 亮度感知 + 滚动亮感（流光时玻璃短暂泛白，像被光拖过） */
      var lum = 0.2126 * base[0] + 0.7152 * base[1] + 0.0722 * base[2];
      var wh, tt;
      if (dark) {
        wh = 0.045 + (255 - lum) / 255 * 0.035;
        tt = 0.15 + (1 - lum / 255) * 0.09;
      } else {
        wh = 0.10 + (lum / 255) * 0.10;
        tt = 0.10 + (lum / 255) * 0.08;
      }
      g.el.style.setProperty("--lg-wh", Math.min(0.28, wh * (1 + spd * 0.008)).toFixed(3));
      g.el.style.setProperty("--lg-tt", tt.toFixed(3));
      g.el.style.setProperty("--lg-stretch", (1 + spd * 0.004).toFixed(3));

      /* ③ 折射投影：O = c*(1-m) - TL，叠加滚动阻尼 lag 与视差 */
      var m = REFR_M;
      var ox = cx * (1 - m) - g.x1;
      var oy = cy * (1 - m) - g.y1 + lag;
      g.el.style.setProperty("--refr-pos", projectPos(g, ox, oy, m));
      g.el.style.setProperty("--refr-size", projectSize(g, m));
    }
    updateMagRects();
  }

  function scheduleGlasses() {
    if (glassRaf) return;
    glassRaf = requestAnimationFrame(updateGlasses);
  }

  function initScene() {
    SCENE = parseGradient(getComputedStyle(document.body).backgroundImage) || SCENE;
    SCENE.orbs = $all(".orb").map(function (o) {
      var r = o.getBoundingClientRect();
      var c = getComputedStyle(o).backgroundColor;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2, c: parseCssColor(c) };
    });
    if (SCENE.orbs.length) updateGlasses();
  }

  /* --- 磁性吸附：指针细设备上，卡片距指针 < 半径时被微微吸起 --- */
  function refreshMagCards() {
    if (reduceMotion) return;
    MAG_CARDS = [];
    $all(".feature-card").forEach(function (el) {
      var r = el.getBoundingClientRect();
      MAG_CARDS.push({ el: el, x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(r.width, r.height) / 2 + 60 });
    });
  }
  function updateMagRects() {
    for (var i = 0; i < MAG_CARDS.length; i++) {
      var r = MAG_CARDS[i].el.getBoundingClientRect();
      MAG_CARDS[i].x = r.left + r.width / 2;
      MAG_CARDS[i].y = r.top + r.height / 2;
    }
  }
  function bindMagnetism() {
    if (reduceMotion) return;
    var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    refreshMagCards();
    document.addEventListener("pointermove", function (e) {
      for (var i = 0; i < MAG_CARDS.length; i++) {
        var m = MAG_CARDS[i];
        var dx = e.clientX - m.x, dy = e.clientY - m.y;
        var near = dx * dx + dy * dy < m.r * m.r;
        if (m.el.classList.contains("near") !== near) m.el.classList.toggle("near", near);
      }
    }, { passive: true });
  }

  /* --- 全局光源：指针 = 手 = 灯（细指针设备）；点击 = 涟漪 --- */
  function bindSpecular() {
    if (window.matchMedia("(pointer: coarse)").matches || reduceMotion) return;
    document.addEventListener("pointermove", function (e) {
      LIGHT.x = e.clientX;
      LIGHT.y = e.clientY;
      LIGHT.has = true;
    }, { passive: true });
    document.addEventListener("pointerleave", function () {
      LIGHT.has = false;
    }, { passive: true });
    document.addEventListener("pointerdown", function (e) {
      var el = e.target.closest ? e.target.closest(".glass") : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      addRipple(el,
        Math.round((e.clientX - r.left) / r.width * 100),
        Math.round((e.clientY - r.top) / r.height * 100));
    }, { passive: true });
  }

  /* ---------------- 渲染：数字条 ---------------- */
  function renderStats() {
    var wrap = $("#stats");
    if (!wrap || !CFG.stats || !CFG.stats.length) return;
    wrap.innerHTML = CFG.stats.map(function (s, i) {
      return '<div class="stat-card glass reveal" style="--cr-so:' + stagger(i, 4, 3) + '%">' +
        '<div class="value">' + esc(s.value) + "</div>" +
        '<div class="label">' + esc(pick(s.label)) + "</div></div>";
    }).join("");
  }

  /* ---------------- 渲染：功能 ---------------- */
  function renderFeatures() {
    var wrap = $("#features-list");
    if (!wrap || !CFG.features) return;
    wrap.innerHTML = CFG.features.map(function (f, i) {
      var badge = f.badge ? '<span class="f-badge">' + esc(pick(f.badge)) + "</span>" : "";
      return '<article class="feature-card glass reveal" style="--cr-so:' + stagger(i, 3, 3.4) + '%">' +
        badge +
        '<div class="f-icon">' + svg(f.icon || "cloud") + "</div>" +
        "<h3>" + esc(pick(f.title)) + "</h3>" +
        "<p>" + esc(pick(f.desc)) + "</p></article>";
    }).join("");
  }

  /* ---------------- 渲染：首屏 What's New ---------------- */
  function renderWhatsNew() {
    var el = $("#whats-new");
    if (!el) return;
    var w = CFG.whatsNew;
    if (!w) { el.style.display = "none"; return; }
    var title = el.querySelector(".whats-new-title");
    if (title) title.textContent = pick(w.title) || "";
    var link = w.link || "#download";
    el.setAttribute("href", link);
    // 若配置带 badge/title/desc，缺省用 i18n 兜底已在 HTML 中
  }

  /* ---------------- 渲染：版本信息 ---------------- */
  function renderVersionInfo() {
    var v = CFG.version || {};
    var abis = (CFG.downloads || []).map(function (d) { return d.abi; }).join(" / ") || "-";
    var sizes = (CFG.downloads || []).map(function (d) { return d.size; }).join(" / ") || "-";
    var rows = [
      { k: t("download.file"), v: v.code ? v.current + " (build " + v.code + ")" : v.current },
      { k: t("download.arch"), v: abis },
      { k: t("download.size"), v: sizes },
      { k: t("download.date"), v: v.releaseDate || "-" },
      { k: t("download.min"), v: pick(v.minLabel) || "-" },
      { k: t("download.target"), v: pick(v.targetLabel) || "-" }
    ];
    var html = rows.map(function (r) {
      return '<div class="v-row"><span class="k">' + esc(r.k) + '</span><span class="v">' + esc(r.v) + "</span></div>";
    }).join("");
    $("#version-table").innerHTML = html;
  }

  /* ---------------- 渲染：下载 ---------------- */
  function basename(p) { return String(p).split("/").pop(); }

  function renderDownloadArea() {
    var badge = $("#version-badge");
    var stage = $("#dl-stage");
    if (!badge || !stage) return;
    badge.textContent = CFG.version.current + " · " + t("download.label");

    var downloads = CFG.downloads || [];
    var html = '<div class="stage-icon">' + svg("download") + "</div>" +
      "<h4>v" + esc(CFG.version.current) + "</h4>" +
      '<div class="file-name">' + esc(downloads.length ? basename(downloads[0].file) : "-") + "</div>";

    downloads.forEach(function (d, i) {
      html += '<button type="button" class="btn btn-primary btn-block' + (i > 0 ? " btn-sm" : "") + '" data-href="' + esc(d.file) + '">' +
        svg("arrow-down") +
        "<span>" + t("download.get") + " · " + esc(d.abi) + (d.size ? " · " + esc(d.size) : "") + "</span></button>";
    });

    if (CFG.site && CFG.site.releaseUrl) {
      html += '<a class="btn btn-ghost btn-sm btn-mt" href="' + esc(CFG.site.releaseUrl) + '" target="_blank" rel="noopener noreferrer">' +
        svg("external") + "<span>" + t("download.releases") + "</span></a>";
    }

    if (downloads.length) {
      var first = downloads[0];
      if (first) {
        if (first.note) html += '<div class="dl-meta">' + esc(pick(first.note)) + "</div>";
        if (first.sha256) {
          html += '<div class="sha-md5" title="' + esc(t("download.shaHint")) + '" data-sha="' + esc(first.sha256) + '">SHA-256: ' + esc(first.sha256) + "</div>";
        }
      }
    }
    html += '<div class="dl-note">' + esc(pick(CFG.version.minLabel)) + " · " + esc(pick(CFG.version.targetLabel)) + "</div>";

    var hint = $("#hero-hint");
    if (hint) {
      var v = CFG.version || {};
      var sizes = downloads.map(function (d) { return d.size; });
      hint.textContent = "v" + v.current + " · " + pick(v.minLabel) + " · " + pick(v.targetLabel) + (sizes.length ? " · " + sizes.join(" / ") : "");
    }
    stage.innerHTML = html;
  }

  /* ---------------- 渲染：安装步骤 ---------------- */
  function renderSteps() {
    var wrap = $("#steps-list");
    if (!wrap || !CFG.installSteps) return;
    wrap.innerHTML = CFG.installSteps.map(function (s, i) {
      return '<div class="step glass reveal" style="--cr-so:' + stagger(i, 4, 2.2) + '%">' +
        "<div class=\"num\"></div>" +
        "<h5>" + esc(pick(s.title)) + "</h5>" +
        "<p>" + esc(pick(s.desc)) + "</p></div>";
    }).join("");
  }

  /* ---------------- 渲染：更新日志 ---------------- */
  function renderChangelog() {
    var details = $("#changelog");
    if (!details) return;
    var logs = (CFG.version && CFG.version.changelog) || [];
    if (!logs.length) { details.style.display = "none"; return; }
    details.style.display = "";
    var html = logs.map(function (log) {
      var items = pick(log.items) || [];
      var lis = items.map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("");
      return '<div class="log-item"><div class="log-head">' + esc(log.version) +
        (log.date ? " <time>" + esc(log.date) + "</time>" : "") + "</div><ul>" + lis + "</ul></div>";
    }).join("");
    var sg = details.querySelector("summary");
    sg.textContent = t("download.changelog");
    details.innerHTML = sg.outerHTML + html;
  }

  /* ---------------- 渲染：截图 ---------------- */
  function renderShots() {
    var wrap = $("#shots-list");
    if (!wrap) return;
    if (!CFG.screenshots || !CFG.screenshots.length) {
      wrap.innerHTML = '<p class="shot-empty">' + esc(t("shots.empty")) + "</p>";
      return;
    }
    wrap.innerHTML = CFG.screenshots.map(function (src, i) {
      return '<figure class="shot-card glass reveal" style="--cr-so:' + stagger(i, 3, 3) + '%">' +
        '<div class="shot-frame"><img src="' + esc(src) + '" alt="Screenshot ' + (i + 1) + '" loading="lazy"></div></figure>';
    }).join("");
    $all("img", wrap).forEach(function (img) {
      img.addEventListener("error", function () {
        var card = img.closest(".shot-card");
        if (card) card.style.display = "none";
      });
    });
  }

  /* ---------------- 渲染：FAQ ---------------- */
  function renderFaq() {
    var wrap = $("#faq-list");
    if (!wrap || !CFG.faqs) return;
    wrap.innerHTML = CFG.faqs.map(function (f, i) {
      return '<details class="faq-item glass reveal" style="--cr-so:' + stagger(i, 2, 2.6) + '%"' + (i === 0 ? " open" : "") + "><summary>" + esc(pick(f.q)) +
        '</summary><div class="faq-a">' + esc(pick(f.a)) + "</div></details>";
    }).join("");
  }

  /* ---------------- 渲染：页脚 ---------------- */
  function renderFooter() {
    var year = $("#footer-year");
    if (year) year.textContent = String(new Date().getFullYear());
    var links = $("#footer-links");
    if (links) {
      var site = CFG.site || {};
      var html = "";
      if (site.homepage) html += '<a href="' + esc(site.homepage) + '" target="_blank" rel="noopener noreferrer">' + esc(t("footer.homepage")) + "</a>";
      if (site.github) html += '<a href="' + esc(site.github) + '" target="_blank" rel="noopener noreferrer">' + esc(t("footer.github")) + "</a>";
      links.innerHTML = html;
    }
    var note = $("#footer-note");
    if (note) {
      var site = CFG.site || {};
      var parts = [];
      if (site.disclaimer) parts.push(pick(site.disclaimer));
      if (site.isThirdParty) {
        parts.push("© " + new Date().getFullYear() + " " + esc(pick(site.copyright)) + " · " + esc(t("footer.copyright")));
      }
      note.innerHTML = parts.join(" ");
    }
  }

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    var old = $("#toast");
    if (old) old.remove();
    var el = document.createElement("div");
    el.id = "toast";
    el.textContent = msg;
    el.setAttribute("role", "status");
    el.style.cssText =
      "position:fixed;left:50%;bottom:30px;transform:translateX(-50%);z-index:99;" +
      "padding:10px 22px;border-radius:999px;font-size:.9rem;color:#fff;" +
      "background:linear-gradient(125deg,var(--accent-start),var(--accent-mid) 60%,var(--accent-end));" +
      "box-shadow:0 16px 40px -12px rgba(99,102,241,.65);opacity:0;transition:opacity .3s var(--ease-expo)";
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = "1"; });
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 350);
    }, 1800);
  }

  /* ---------------- 交互 ---------------- */
  function bindInteractions() {
    document.addEventListener("click", function (e) {
      var dl = e.target.closest("[data-href]");
      if (dl) {
        var a = document.createElement("a");
        a.href = dl.getAttribute("data-href");
        a.setAttribute("download", "");
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      var sha = e.target.closest("[data-sha]");
      if (sha) {
        var val = sha.getAttribute("data-sha");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val).then(function () { toast(t("download.shaCopied")); });
        } else {
          toast(t("download.shaCopied"));
        }
      }
    });

    $("#theme-btn").addEventListener("click", function () {
      applyTheme(theme() === "dark" ? "light" : "dark");
    });
    $("#lang-btn").addEventListener("click", function () {
      applyLang(lang() === "zh" ? "en" : "zh");
    });
    var floatBtn = $("#float-download");
    if (floatBtn) floatBtn.addEventListener("click", function () {
      var el = $("#download");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------- 光斑视差（rAF 缓动循环） ---------------- */
  function bindParallax() {
    var coarse = window.matchMedia("(pointer: coarse)").matches;
    var bg = $(".bg");
    if (!bg || reduceMotion || coarse) return;
    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = 0;

    window.addEventListener("mousemove", function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2 * 14;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2 * 10;
      if (!raf) loop();
    }, { passive: true });

    function loop() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      bg.style.transform = "translate3d(" + curX.toFixed(2) + "px," + curY.toFixed(2) + "px,0)";
      parallaxDx = curX;
      parallaxDy = curY;
      scheduleGlasses();   /* 折射层随视差重投影 */
      raf = (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1)
        ? requestAnimationFrame(loop)
        : 0;
    }
  }

  /* ---------------- 滚动显现（cr-sd 关闭时的 IO 回退） ---------------- */
  function bindReveal() {
    if (crSdSupported || reduceMotion) return;
    if (!("IntersectionObserver" in window)) {
      $all(".reveal").forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    $all(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 启动 ---------------- */
  function renderAll() {
    renderWhatsNew();
    renderStats();
    renderFeatures();
    renderVersionInfo();
    renderDownloadArea();
    renderSteps();
    renderChangelog();
    renderShots();
    renderFaq();
    renderFooter();
    bindReveal();
    scheduleGlasses();
    refreshMagCards();
  }

  function init() {
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", siteStr("description"));
    var metaKw = $('meta[name="keywords"]');
    if (metaKw) metaKw.setAttribute("content", CFG.site.keywords || "");

    applyLang(detectLang());
    renderThemeBtn();
    bindInteractions();
    bindParallax();
    bindSpecular();
    bindMagnetism();
    initScene();
    bindReveal();

    window.addEventListener("scroll", function () {
      var y = window.scrollY || 0;
      scrollVel = y - scrollPrev;
      scrollPrev = y;
      scheduleGlasses();
    }, { passive: true });
    window.addEventListener("resize", scheduleGlasses, { passive: true });
    window.addEventListener("resize", function () { initScene(); refreshMagCards(); }, { passive: true });
    document.addEventListener("visibilitychange", startLight, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();