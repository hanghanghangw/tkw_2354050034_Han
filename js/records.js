const state = {
  records: [],
  query: "",
  course: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null,
};

async function loadRecords() {
  const response =
    await fetch("./data/records.json");

  if (!response.ok) {
    throw new Error(
      `Máy chủ trả về ${response.status}`
    );
  }

  return response.json();
}

function buildRow(record) {
  const template =
    document.getElementById("record-template");

  const row =
    template.content.firstElementChild.cloneNode(true);

  row.querySelector(
    "[data-cell='id']"
  ).textContent = record.id;

  row.querySelector(
    "[data-cell='student']"
  ).textContent = record.student;

  row.querySelector(
    "[data-cell='course']"
  ).textContent = record.course;

  row.querySelector(
    "[data-cell='status']"
  ).textContent = record.status;

  row.querySelector(
    "[data-cell='score']"
  ).textContent = record.score;

  row.querySelector(
    "[data-cell='amount']"
  ).textContent =
    new Intl.NumberFormat("vi-VN").format(
      record.amount
    ) + " đ";

  row.querySelector(
    "[data-cell='date']"
  ).textContent = record.date;

  return row;
}

function render() {
  const loading =
    document.getElementById("records-loading");

  const error =
    document.getElementById("records-error");

  const empty =
    document.getElementById("records-empty");

  const content =
    document.getElementById("records-content");

  const tbody =
    document.getElementById("records-body");

  loading.classList.add("hidden");
  error.classList.add("hidden");
  empty.classList.add("hidden");
  content.classList.add("hidden");

  // Loading
  if (state.loading) {
    loading.classList.remove("hidden");
    return;
  }

  // Error
  if (state.error) {
    error.textContent = state.error;
    error.classList.remove("hidden");
    return;
  }

  // Empty
  if (state.records.length === 0) {
    empty.classList.remove("hidden");
    return;
  }

  // Có dữ liệu
  const rows =
    state.records.map(buildRow);

  tbody.replaceChildren(...rows);

  content.classList.remove("hidden");
}

export async function initRecords() {
  const root =
    document.getElementById("records-content");

  if (!root) return;

  render();

  try {
    state.records =
      await loadRecords();
  } catch (error) {
    state.error =
      `Không tải được dữ liệu: ${error.message}`;
  } finally {
    state.loading = false;
    render();
  }
}