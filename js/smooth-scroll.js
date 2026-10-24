/**
 * Lenis 平滑滚动（无主题系统，单一白色方案）
 */
(function () {
  function init() {
    if (!window.Lenis || !window.gsap || !window.ScrollTrigger) {
      return setTimeout(init, 40);
    }
    const lenis = new window.Lenis({
      lerp: 0.13,
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.1,
    });
    lenis.on("scroll", window.ScrollTrigger.update);
    window.gsap.ticker.add((t) => lenis.raf(t * 1000));
    window.gsap.ticker.lagSmoothing(0);

    window.lenis = lenis;

    // 顶部进度条
    const bar = document.getElementById("scroll-progress");
    lenis.on("scroll", ({ scroll, limit }) => {
      if (bar) bar.style.width = (limit > 0 ? (scroll / limit) * 100 : 0) + "%";
    });

    // 顶部品牌条滚动阴影
    const topbar = document.getElementById("topbar");
    lenis.on("scroll", ({ scroll }) => {
      topbar && topbar.classList.toggle("is-pinned", scroll > 60);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
