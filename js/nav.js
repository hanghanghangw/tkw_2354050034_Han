export function initNav() {
  const header = document.querySelector("header");
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!header || !toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Đóng menu" : "Mở menu"
    );

    document.body.classList.toggle("overflow-hidden", open);
  }

  toggle.addEventListener("click", () => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    setOpen(!isOpen);
  });

  // Đóng bằng ESC
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) return;

    setOpen(false);
    toggle.focus();
  });

  // Bấm ra ngoài header thì đóng
  document.addEventListener("click", (event) => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) return;

    if (!header.contains(event.target)) {
      setOpen(false);
    }
  });

  // Lên desktop thì tự đóng menu mobile
  const desktop = window.matchMedia("(min-width: 1024px)");

  function handleDesktop(event) {
    if (event.matches) {
      setOpen(false);
    }
  }

  desktop.addEventListener("change", handleDesktop);
}


export function initHeaderOnScroll() {
  const header = document.querySelector("header");
  const sentinel = document.getElementById("nav-sentinel");

  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;

    header.classList.toggle("shadow-sm", scrolled);
    header.classList.toggle("border-line", scrolled);
  });

  observer.observe(sentinel);
}


export function initToTop() {
  const button = document.getElementById("to-top");
  if (!button) return;

  function updateVisibility() {
    const shouldShow = window.scrollY > 400;

    button.classList.toggle("hidden", !shouldShow);
    button.setAttribute("aria-hidden", String(!shouldShow));
  }

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, {
    passive: true,
  });
}