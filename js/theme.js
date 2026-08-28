export function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  function updateButton() {
    const dark = isDark();

    toggle.setAttribute(
      "aria-label",
      dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
    );

    toggle.setAttribute("aria-pressed", String(dark));
  }

  toggle.addEventListener("click", () => {
    const dark = !isDark();

    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );

    updateButton();
  });

  updateButton();
}