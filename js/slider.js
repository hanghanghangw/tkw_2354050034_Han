export function initSlider() {
  const root = document.querySelector("[data-slider]");
  if (!root) return;

  const track = root.querySelector("[data-slider-track]");
  const slides = [...root.querySelectorAll("[data-slide]")];
  const prevButton = root.querySelector("[data-slider-prev]");
  const nextButton = root.querySelector("[data-slider-next]");
  const dotsRoot = root.querySelector("[data-slider-dots]");

  if (
    !track ||
    !slides.length ||
    !prevButton ||
    !nextButton ||
    !dotsRoot
  ) {
    return;
  }

  let currentIndex = 0;
  let autoplayId = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className =
      "h-3 w-3 rounded-full border border-line transition";

    dot.setAttribute(
      "aria-label",
      `Đi đến đánh giá ${index + 1}`
    );

    dot.addEventListener("click", () => {
      go(index);
    });

    dotsRoot.appendChild(dot);

    return dot;
  });

  function update() {
    track.style.transform =
      `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const active = index === currentIndex;

      slide.toggleAttribute("inert", !active);

      slide.setAttribute(
        "aria-hidden",
        String(!active)
      );
    });

    dots.forEach((dot, index) => {
      const active = index === currentIndex;

      dot.classList.toggle(
        "bg-brand-600",
        active
      );

      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function go(next) {
    currentIndex =
      (next + slides.length) % slides.length;

    update();
  }

  function nextSlide() {
    go(currentIndex + 1);
  }

  function prevSlide() {
    go(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    autoplayId = setInterval(
      nextSlide,
      4000
    );
  }

  prevButton.addEventListener(
    "click",
    prevSlide
  );

  nextButton.addEventListener(
    "click",
    nextSlide
  );

  root.addEventListener(
    "mouseenter",
    stopAutoplay
  );

  root.addEventListener(
    "mouseleave",
    startAutoplay
  );

  root.addEventListener(
    "focusin",
    stopAutoplay
  );

  root.addEventListener(
    "focusout",
    (event) => {
      if (!root.contains(event.relatedTarget)) {
        startAutoplay();
      }
    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  update();
  startAutoplay();
}