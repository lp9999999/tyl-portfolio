/**
 * Main：加载就绪 + 首屏后刷新触发器
 */
(function () {
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.documentElement.classList.add("is-ready");
      window.ScrollTrigger && window.ScrollTrigger.refresh();
    }, 300);
  });
  // 兜底
  setTimeout(() => document.documentElement.classList.add("is-ready"), 2500);
})();
