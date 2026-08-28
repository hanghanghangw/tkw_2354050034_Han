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
  window.addEventListener("scroll", updateVisibility, { passive: true });
}