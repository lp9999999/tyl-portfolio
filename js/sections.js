/**
 * 层叠覆盖：
 * - 内容面板一旦上滑覆盖标题屏 → 标题屏立即最大高斯模糊
 * - 反向滑回、面板离开 → 模糊立即恢复正常
 * - 注入粉色标题下划线
 */
(function () {

  function ready(cb) {
    if (window.gsap && window.ScrollTrigger) cb();
    else setTimeout(() => ready(cb), 40);
  }
  ready(init);

  function init() {
    const gsap = window.gsap, ST = window.ScrollTrigger;

    /* 给每个标题屏注入粉色下划线 */
    document.querySelectorAll(".title-screen").forEach((screen) => {
      const title = screen.querySelector(".title");
      if (title && !screen.querySelector(".title-bar")) {
        title.insertAdjacentHTML("afterend", '<span class="title-bar"></span>');
      }
      ST.create({
        trigger: screen,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => screen.classList.toggle("is-inview", self.isActive),
      });
    });

    /* 模块标题屏：由紧随其后的内容面板决定模糊态（双向可靠）。
       最后一页（#contact）不做模糊：已是尾页，无需覆盖提示。 */
    document.querySelectorAll(".module").forEach((mod) => {
      if (mod.id === "contact") return;
      const screen = mod.querySelector(".title-screen");
      const panel = mod.querySelector(".panel");
      if (!screen || !panel) return;

      ST.create({
        trigger: panel,
        start: "top 96%",   // 面板顶部一进入视口（开始覆盖标题屏）
        end: "max",        // 覆盖期间一直保持
        onToggle: (self) => screen.classList.toggle("is-covered", self.isActive),
      });
    });

    /* 懒加载图片加载完成后刷新触发点：
       避免图片撑开布局导致下方模块的模糊触发点漂移（回滑后模糊残留的根因） */
    let rfTimer = null;
    const lazyRefresh = () => {
      clearTimeout(rfTimer);
      rfTimer = setTimeout(() => ST.refresh(), 250);
    };
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (!img.complete) img.addEventListener("load", lazyRefresh, { once: true });
    });

    /* 封面屏：由紧随其后的 02 标题屏决定（标题屏开始上盖 → 封面立即最大模糊；滑回 → 恢复） */
    const coverScreen = document.querySelector(".cover-screen");
    const firstTitle = document.querySelector("#about .title-screen");
    if (coverScreen && firstTitle) {
      ST.create({
        trigger: firstTitle,
        start: "top 98%",
        end: "max",
        onToggle: (self) => coverScreen.classList.toggle("is-covered", self.isActive),
      });
    }

    /* 大序号视差（仅被覆盖期间轻微上移） */
    document.querySelectorAll(".title-num").forEach((num) => {
      gsap.fromTo(num,
        { yPercent: 0 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: num.closest(".title-screen"),
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });

    ST.refresh();
  }

})();
