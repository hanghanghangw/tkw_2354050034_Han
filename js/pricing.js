export function initPricing() {
  const root = document.getElementById("pricing");
  if (!root) return;

  const toggle = root.querySelector("[data-billing-toggle]");
  const priceItems = root.querySelectorAll("[data-price]");
  const periods = root.querySelectorAll("[data-period]");

  if (!toggle || !priceItems.length) return;

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  function updatePrices(yearly) {
    priceItems.forEach((item) => {
      const monthlyPrice = Number(item.dataset.monthly);
      const yearlyPrice = Number(item.dataset.yearly);

      const price = yearly ? yearlyPrice : monthlyPrice;

      item.textContent = formatter.format(price);
    });

    periods.forEach((period) => {
      period.textContent = yearly
        ? "/ năm"
        : period.dataset.defaultPeriod;
    });

    toggle.setAttribute("aria-checked", String(yearly));

    const knob = toggle.querySelector("[data-switch-knob]");

    if (knob) {
      knob.classList.toggle("translate-x-6", yearly);
    }
  }

  periods.forEach((period) => {
    period.dataset.defaultPeriod =
      period.textContent.trim();
  });

  toggle.addEventListener("click", () => {
    const isYearly =
      toggle.getAttribute("aria-checked") === "true";

    updatePrices(!isYearly);
  });

  updatePrices(false);
}