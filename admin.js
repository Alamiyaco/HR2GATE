if (sessionStorage.getItem("admin_auth") !== "true") {
  window.location.href = "index.html";
}

const ADMIN_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbx-OHXVHE04HwudHzROJrdSWLQ1zGiNU2BbGyry0AkOSg9LQAimv8cpcUhe9LwjV9EvHw/exec"
};

const cardsContainer = document.getElementById("adminCardsList");

function esc(str) {
  return (str || "").toString().replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "y";
}

function toNum(v, fallback = 9999) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function logoutAdmin() {
  sessionStorage.removeItem("admin_auth");
  window.location.href = "index.html";
}

function renderCards(cards) {
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  const activeCards = (cards || [])
    .filter(card => toBool(card.isActive ?? true))
    .sort((a, b) => toNum(a.sortOrder, 9999) - toNum(b.sortOrder, 9999));

  if (activeCards.length === 0) {
    cardsContainer.innerHTML = `
      <div class="card">
        <h3>لا توجد بطاقات حالياً</h3>
        <p>قم بإضافة بيانات داخل شيت AdminCards.</p>
      </div>
    `;
    return;
  }

  activeCards.forEach(card => {
    const item = document.createElement("div");
    item.className = "card";
    item.innerHTML = `
      <div style="display:flex; justify-content:flex-start; margin-bottom:14px;">
        <span style="
          background: rgba(52,152,219,0.12);
          color:#3498db;
          padding:8px 14px;
          border-radius:999px;
          font-weight:800;
          font-size:.95rem;
        ">
          ${esc(card.tag || "عام")}
        </span>
      </div>

      <h3>${esc(card.title || "بدون عنوان")}</h3>
      <p>${esc(card.description || "")}</p>

      <a href="${esc(card.linkUrl || "#")}" target="_blank" rel="noopener">
        ${esc(card.linkText || "الدخول")}
      </a>
    `;
    cardsContainer.appendChild(item);
  });
}

async function loadAdminCards() {
  try {
    const res = await fetch(`${ADMIN_CONFIG.apiUrl}?type=admincards`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const cards = data.adminCards || [];
    renderCards(cards);
  } catch (err) {
    console.error(err);
    cardsContainer.innerHTML = `
      <div class="card">
        <h3>تعذر تحميل البطاقات</h3>
        <p>راجع رابط السكربت وإعادة النشر.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadAdminCards);
