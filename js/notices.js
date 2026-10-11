// =========================================================
// StudentHub Portal — notices.html data module (Practical 6)
// Fetches data/notices.json via the Fetch API, then renders,
// searches, filters, sorts, and paginates it entirely client-side.
// =========================================================

(function () {
  const listEl = document.getElementById("notice-list");
  if (!listEl) return; // only run on notices.html

  const searchEl = document.getElementById("notice-search");
  const categoryEl = document.getElementById("notice-category");
  const sortEl = document.getElementById("notice-sort");
  const resultCountEl = document.getElementById("notice-result-count");
  const loadingEl = document.getElementById("notice-loading");
  const errorEl = document.getElementById("notice-error");
  const paginationEl = document.getElementById("notice-pagination");

  const PAGE_SIZE = 5;
  let allNotices = [];   // raw data from JSON
  let currentPage = 1;

  // ---------- Fetch ----------
  function loadNotices() {
    loadingEl.hidden = false;
    errorEl.hidden = true;
    listEl.hidden = true;

    fetch("data/notices.json")
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then((data) => {
        allNotices = data;
        loadingEl.hidden = true;
        listEl.hidden = false;
        render();
      })
      .catch((err) => {
        console.error("Failed to load notices:", err);
        loadingEl.hidden = true;
        errorEl.hidden = false;
      });
  }

  // ---------- Search + filter + sort pipeline ----------
  function getProcessedNotices() {
    const query = searchEl.value.trim().toLowerCase();
    const category = categoryEl.value;
    const sortBy = sortEl.value;

    let result = allNotices.filter((notice) => {
      const matchesQuery =
        !query ||
        notice.title.toLowerCase().includes(query) ||
        notice.message.toLowerCase().includes(query);
      const matchesCategory = !category || notice.category === category;
      return matchesQuery && matchesCategory;
    });

    const priorityRank = { urgent: 0, normal: 1 };
    result = result.slice().sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "priority":
          return priorityRank[a.priority] - priorityRank[b.priority] || new Date(b.date) - new Date(a.date);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "date-desc":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }

  // ---------- Render ----------
  function render() {
    const processed = getProcessedNotices();
    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = processed.slice(start, start + PAGE_SIZE);

    resultCountEl.textContent = processed.length
      ? `Showing ${start + 1}\u2013${start + pageItems.length} of ${processed.length} notice${processed.length === 1 ? "" : "s"}`
      : "No notices match your search.";

    listEl.innerHTML = "";
    pageItems.forEach((notice) => {
      const li = document.createElement("li");
      const formattedDate = new Date(notice.date).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
      li.innerHTML = `
        <article>
          <div class="notice-head">
            <h3>${escapeHtml(notice.title)}</h3>
            <span class="badge ${notice.priority === "urgent" ? "badge-urgent" : ""}">${escapeHtml(notice.category)}</span>
          </div>
          <p><time datetime="${notice.date}">${formattedDate}</time></p>
          <p>${escapeHtml(notice.message)}</p>
        </article>
      `;
      listEl.appendChild(li);
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationEl.innerHTML = "";
    paginationEl.hidden = totalPages <= 1;
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => { currentPage--; render(); });
    paginationEl.appendChild(prevBtn);

    for (let page = 1; page <= totalPages; page++) {
      const pageBtn = document.createElement("button");
      pageBtn.type = "button";
      pageBtn.textContent = String(page);
      pageBtn.setAttribute("aria-current", page === currentPage ? "page" : "false");
      pageBtn.addEventListener("click", () => { currentPage = page; render(); });
      paginationEl.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => { currentPage++; render(); });
    paginationEl.appendChild(nextBtn);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Event wiring ----------
  let searchDebounce;
  searchEl.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => { currentPage = 1; render(); }, 250);
  });
  categoryEl.addEventListener("change", () => { currentPage = 1; render(); });
  sortEl.addEventListener("change", () => { currentPage = 1; render(); });

  loadNotices();
})();