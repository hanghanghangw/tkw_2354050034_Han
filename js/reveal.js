
export function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    items.forEach((item) => {
      item.classList.remove("opacity-0", "translate-y-6");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove(
          "opacity-0",
          "translate-y-6"
        );

        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    }
  );

  items.forEach((item) => {
    item.classList.add(
      "opacity-0",
      "translate-y-6",
      "transition",
      "duration-700"
    );

    observer.observe(item);
  });
}