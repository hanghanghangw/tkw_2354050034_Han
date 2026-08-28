export function initFaq() {
  const root = document.getElementById("faq");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-faq-button]");
    if (!button || !root.contains(button)) return;

    const targetId = button.getAttribute("aria-controls");
    const panel = document.getElementById(targetId);
    if (!panel) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    // đóng tất cả FAQ trước
    const allButtons = root.querySelectorAll("[data-faq-button]");

    allButtons.forEach((item) => {
      const panelId = item.getAttribute("aria-controls");
      const itemPanel = document.getElementById(panelId);

      item.setAttribute("aria-expanded", "false");

      if (itemPanel) {
        itemPanel.classList.add("hidden");
      }
    });

    // nếu câu hiện tại đang đóng thì mở nó
    if (!isOpen) {
      button.setAttribute("aria-expanded", "true");
      panel.classList.remove("hidden");
    }
  });
}