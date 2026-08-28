export function initFaq() {
  const root = document.getElementById("faq");

  if (!root) return;

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-faq-button]");

    if (!button || !root.contains(button)) return;

    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);

    if (!panel) return;

    const isOpen =
      button.getAttribute("aria-expanded") === "true";

    // Đóng tất cả FAQ
    root.querySelectorAll("[data-faq-button]").forEach((item) => {
      const itemPanelId =
        item.getAttribute("aria-controls");

      const itemPanel =
        document.getElementById(itemPanelId);

      const icon =
        item.querySelector("[data-faq-icon]");

      item.setAttribute(
        "aria-expanded",
        "false"
      );

      if (itemPanel) {
        itemPanel.classList.add("hidden");
      }

      if (icon) {
        icon.classList.remove("rotate-180");
      }
    });

    // Nếu FAQ vừa click đang đóng thì mở nó
    if (!isOpen) {
      button.setAttribute(
        "aria-expanded",
        "true"
      );

      panel.classList.remove("hidden");

      const icon =
        button.querySelector("[data-faq-icon]");

      if (icon) {
        icon.classList.add("rotate-180");
      }
    }
  });
}