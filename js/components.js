/**
 * 组件：
 * 1 标题字符翻转 tri / 2 Line Reveal / 3 滚动显现 / 4 全数 Count Up /
 * 5 精修对比滑块 / 6 技能条 / 7 案例纸牌扇形 / 8 3D Tilt / 9 左目录 / 10 封面入场
 */
(function () {

  function ready(cb) {
    if (window.gsap && window.ScrollTrigger) cb();
    else setTimeout(() => ready(cb), 40);
  }
  ready(init);

  function init() {
    triSplit();
    lineReveal();
    coverIntro();
    scrollReveal();
    countUpAll();
    compareSliders();
    skillBars();
    worksDeck();
    tiltCards();
    sideNav();
    mobileNav();
    videoMasks();
  }

  /* ---------- 1. 标题字符翻转（先拆字，lineReveal 会整体包进遮罩） ---------- */
  function triSplit() {
    document.querySelectorAll(".title-screen .title.tri").forEach((title) => {
      if (title._tri) return;
      title._tri = true;
      const text = title.textContent;
      title.textContent = "";
      [...text].forEach((ch, i) => {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.setProperty("--d", i);
        title.appendChild(s);
      });
      const screen = title.closest(".title-screen");
      window.ScrollTrigger.create({
        trigger: screen,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => screen.classList.toggle("tri-play", self.isActive),
      });
    });
  }

  /* ---------- 2. Line Reveal ---------- */
  function lineReveal() {
    document.querySelectorAll("[data-line]").forEach((el) => {
      if (el._wrapped) return;
      el._wrapped = true;
      const nodes = Array.from(el.childNodes);
      const mask = document.createElement("span");
      mask.className = "line-mask";
      const inner = document.createElement("span");
      inner.className = "line-inner";
      nodes.forEach((n) => inner.appendChild(n));
      mask.appendChild(inner);
      el.appendChild(mask);

      window.ScrollTrigger.create({
        trigger: el,
        start: "top 86%",
        once: true,
        onEnter: () => el.classList.add("is-inview"),
      });
    });
  }

  /* ---------- 10. 封面入场（错峰） ---------- */
  function coverIntro() {
    const gsap = window.gsap;
    gsap.set(".cover-orbit path", { strokeDasharray: 900, strokeDashoffset: 900, opacity: 0 });
    gsap.set(".cover-orbit polygon", { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    tl.fromTo(".cover-blob", { opacity: 0, scale: 0.9 }, { opacity: 0.5, scale: 1, duration: 1.2, stagger: 0.15 }, 0)
      .fromTo(".cover-text .cv-y", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12 }, 0.3)
      .fromTo(".cover-line", { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.55)
      .fromTo(".cover-art", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.65)
      .fromTo(".cc-card", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.15 }, 0.8)
      .to(".cover-orbit path", { strokeDashoffset: 0, opacity: 0.7, duration: 1.1, stagger: 0.18, ease: "power1.inOut" }, 0.75)
      .to(".cover-orbit polygon", { opacity: 1, duration: 0.5, stagger: 0.12 }, 1.6)
      .fromTo(".cover-bottom .cv-y", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.25);
  }

  /* ---------- 3. 滚动显现 ---------- */
  function scrollReveal() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    ST.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }),
    });
  }

  /* ---------- 4. 全部数字 Count Up ---------- */
  function countUpAll() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    document.querySelectorAll(".cu").forEach((el) => {
      if (el._cu) return;
      el._cu = true;
      const to = parseFloat(el.dataset.to || "0");
      const dec = parseInt(el.dataset.dec || (to % 1 === 0 ? "0" : "1"), 10);

      ST.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          const h = { v: 0 };
          gsap.to(h, {
            v: to,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              const n = dec === 0 ? Math.round(h.v) : h.v.toFixed(dec);
              el.textContent = dec === 0 ? Number(n).toLocaleString("en-US") : n;
            },
          });
        },
      });
    });
  }

  /* ---------- 5. 精修前后滑块 ---------- */
  function compareSliders() {
    document.querySelectorAll("[data-compare]").forEach((box) => {
      const overlay = box.querySelector(".compare-overlay");
      const handle = box.querySelector(".compare-handle");
      let p = 50, dragging = false;

      const setP = (v) => {
        p = Math.max(0, Math.min(100, v));
        overlay.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        handle.style.left = p + "%";
      };
      const pos = (e) => {
        const r = box.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        return (x / r.width) * 100;
      };

      /* 屏障：只有按住中间圆形手柄才拖动滑块，画面其余区域不接管手势，
         手机端纵向滑动手势可正常穿透（CSS touch-action: pan-y） */
      handle.addEventListener("mousedown", (e) => { dragging = true; setP(pos(e)); e.preventDefault(); });
      window.addEventListener("mousemove", (e) => dragging && setP(pos(e)));
      window.addEventListener("mouseup", () => (dragging = false));
      handle.addEventListener("touchstart", (e) => { dragging = true; setP(pos(e)); }, { passive: true });
      window.addEventListener("touchmove", (e) => dragging && setP(pos(e)), { passive: true });
      window.addEventListener("touchend", () => (dragging = false));
      setP(50);

      let t = 0, dir = 1, v = 18;
      const demo = () => {
        if (t > 110) { setP(50); return; }
        v += dir * 0.9;
        if (v > 82) dir = -1;
        if (v < 18) dir = 1;
        setP(v); t++;
        requestAnimationFrame(demo);
      };
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting) { requestAnimationFrame(demo); io.disconnect(); }
        });
      }, { threshold: 0.3 });
      io.observe(box);
    });
  }

  /* ---------- 6. 技能进度条 + Beam ---------- */
  function skillBars() {
    const ST = window.ScrollTrigger;
    document.querySelectorAll(".sk-bar b").forEach((bar) => {
      const fill = parseFloat(bar.closest(".skill-card").querySelector(".sk-level .cu")?.dataset.to || "98");
      ST.create({
        trigger: bar,
        start: "top 88%",
        once: true,
        onEnter: () => {
          bar.style.width = fill + "%";
          const beam = bar.parentElement.querySelector(".sk-beam");
          if (beam) beam.style.setProperty("--barw", bar.offsetWidth + "px");
          bar.closest(".skill-card")?.classList.add("is-inview");
        },
      });
    });
  }

  /* ---------- 7. 案例：常驻纸牌扇形（hover 联动 / 拖拽 / 自动轮播，不展开） ---------- */
  function worksDeck() {
    const stage = document.querySelector("[data-works]");
    if (!stage) return;
    const viewport = stage.querySelector(".works-viewport");
    const cards = Array.from(stage.querySelectorAll(".w-card"));
    const dotsWrap = stage.querySelector("[data-dots]");
    const prev = stage.querySelector(".w-prev");
    const next = stage.querySelector(".w-next");
    const gsap = window.gsap;

    const N = cards.length;
    let active = 0;
    let hoverIdx = -1;
    let autoTimer = null;
    let dragging = false;

    dotsWrap.innerHTML = "";
    const dots = cards.map((_, i) => {
      const d = document.createElement("button");
      d.className = "w-dot" + (i === active ? " is-active" : "");
      d.setAttribute("aria-label", `第 ${i + 1} 张`);
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
      return d;
    });

    function wrap(x) {
      x = x % N;
      if (x < 0) x += N;
      return x;
    }

    function applySizes() {
      // 竖版卡：宽度同时受视口高与宽约束，保证 7 张扇形整组落在 90vw 内
      const ratio = 1125 / 2436;
      // 手机端：单张图放大到约 70vw，保证内容看得清
      const isMobile = window.innerWidth <= 900;
      const w = isMobile
        ? Math.min(window.innerWidth * 0.72, window.innerHeight * 0.66 * ratio)
        : Math.min(window.innerHeight * 0.78 * ratio, window.innerWidth * 0.21);
      const h = w / ratio;
      cards.forEach((c) => {
        c.style.width = w + "px";
        c.style.height = h + "px";
        c.style.marginLeft = -w / 2 + "px";
        c.style.marginTop = -h / 2 + "px";
      });
    }

    function positions() {
      const w = parseFloat(cards[0].style.width) || 200;
      const isMobile = window.innerWidth <= 900;
      const spread = isMobile ? 0.36 : 0.56; // 手机端扇形收拢，突出当前大图
      const rot = isMobile ? 5 : 6;
      return cards.map((_, i) => {
        let d = i - active;
        if (d > N / 2) d -= N;
        if (d < -N / 2) d += N;
        const ad = Math.abs(d);
        let x = d * w * spread;
        let y = ad * 12;
        let scale = Math.max(0.55, 1 - ad * 0.1);
        let opacity = ad >= 3 ? 0.4 : 1;
        let z = 30 - ad;

        if (hoverIdx >= 0) {
          let hd = i - hoverIdx;
          if (hd > N / 2) hd -= N;
          if (hd < -N / 2) hd += N;
          if (i === hoverIdx) { y -= 16; scale *= 1.05; z = 40; }
          else if (Math.abs(hd) === 1) { x += Math.sign(hd) * 20; opacity = 0.95; z = 25; }
          else { opacity = 0.32; }
        }
        return { x, y, rotate: d * rot, scale, opacity, z };
      });
    }

    function render(duration, stagger) {
      const list = positions();
      cards.forEach((card, i) => {
        const p = list[i];
        card.classList.toggle("is-active", i === active);
        card.classList.toggle("is-hover", i === hoverIdx);
        let ad = Math.abs(i - active);
        if (ad > N / 2) ad = N - ad;
        const delay = stagger ? ad * 0.06 : 0;
        gsap.to(card, {
          x: p.x, y: p.y, rotation: p.rotate, scale: p.scale, opacity: p.opacity, zIndex: p.z,
          duration: duration, delay, ease: "power3.inOut",
        });
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    }

    function go(i) {
      active = wrap(i);
      render(0.6, true);
    }

    prev.addEventListener("click", () => { go(active - 1); restartAuto(); });
    next.addEventListener("click", () => { go(active + 1); restartAuto(); });
    cards.forEach((c, i) => {
      c.addEventListener("click", () => { go(i); restartAuto(); });
      c.addEventListener("mouseenter", () => { hoverIdx = i; render(0.4, false); });
      c.addEventListener("mouseleave", () => { if (hoverIdx === i) { hoverIdx = -1; render(0.4, false); } });
    });

    let startX = 0, moved = false;
    viewport.addEventListener("pointerdown", (e) => {
      dragging = true; moved = false; startX = e.clientX;
      viewport.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", () => { if (dragging) moved = true; });
    window.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      const dx = e.clientX - startX;
      if (moved && Math.abs(dx) > 56) {
        go(dx < 0 ? active + 1 : active - 1);
        restartAuto();
      }
    });

    function startAuto() {
      autoTimer = setInterval(() => {
        if (hoverIdx < 0 && !dragging) go(active + 1);
      }, 4200);
    }
    function restartAuto() { clearInterval(autoTimer); startAuto(); }

    window.addEventListener("resize", () => { applySizes(); render(0, false); });

    applySizes();
    render(0, false);
    startAuto();
  }

  /* ---------- 8. 3D Tilt ---------- */
  function tiltCards() {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const gsap = window.gsap;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
      });
    });
  }

  /* ---------- 11. 视频遮罩：滚入揭示一次（opacity 闪现 + 轻微 scale），点击隐藏并播放 ---------- */
  function videoMasks() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    const block = document.querySelector(".video-block");
    if (!block) return;
    const masks = Array.from(block.querySelectorAll(".video-mask"));
    if (!masks.length) return;

    masks.forEach((mask) => {
      mask.addEventListener("click", () => {
        const frame = mask.closest(".video-frame");
        const video = frame && frame.querySelector("video");
        mask.classList.add("is-hidden");
        if (video) {
          video.controls = true;
          video.muted = false;
          const p = video.play();
          if (p && typeof p.catch === "function") {
            p.catch(() => { video.muted = true; video.play(); });
          }
        }
      });
    });

    ST.create({
      trigger: block,
      start: "top 78%",
      once: true,
      onEnter: () => {
        // 已被点击隐藏的遮罩不再参与揭示
        const targets = masks.filter((m) => !m.classList.contains("is-hidden"));
        const tl = gsap.timeline();
        tl.to(targets, { opacity: 0, scale: 1.02, duration: 0.2, ease: "power2.out", stagger: 0.08 })
          .to({}, { duration: 0.25 })
          .to(targets, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: "power2.inOut",
            stagger: 0.08,
            // 清除内联样式，交还 CSS hover / 常驻动效控制权
            onComplete: () => gsap.set(targets, { clearProps: "opacity,transform" }),
          });
      },
    });
  }

  /* ---------- 12. 移动端抽屉目录（悬浮按钮 + 右侧滑出，不占内容布局） ---------- */
  function mobileNav() {
    const ST = window.ScrollTrigger;
    const fab = document.getElementById("nav-fab");
    const drawer = document.getElementById("nav-drawer");
    const mask = document.getElementById("nav-drawer-mask");
    if (!fab || !drawer || !mask) return;
    const links = Array.from(drawer.querySelectorAll("a"));

    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
    };
    fab.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
    mask.addEventListener("click", () => setOpen(false));

    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setOpen(false);
        window.lenis
          ? window.lenis.scrollTo(target, { offset: 0, duration: 1.3 })
          : target.scrollIntoView({ behavior: "smooth" });
      });
      ST.create({
        trigger: target,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => a.classList.toggle("is-active", self.isActive),
      });
    });
  }

  /* ---------- 9. 左侧目录 ---------- */
  function sideNav() {
    const ST = window.ScrollTrigger;
    const links = Array.from(document.querySelectorAll(".sidenav a"));
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.lenis
          ? window.lenis.scrollTo(target, { offset: 0, duration: 1.3 })
          : target.scrollIntoView({ behavior: "smooth" });
      });
      ST.create({
        trigger: target,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => a.classList.toggle("is-active", self.isActive),
      });
    });
  }

})();
