const PHONE = "+79990000000"; // поменяй на реальный
const SOCIAL = {
  instagram: "https://instagram.com/",   // вставь ссылку или оставь #
  telegram:  "https://t.me/",
  whatsapp:  "https://wa.me/79990000000" // номер без +, без пробелов
};

const modal = document.getElementById("modal");
const btnCopy = document.getElementById("btnCopy");
const year = document.getElementById("year");
const leadForm = document.getElementById("leadForm");
const serviceInput = document.getElementById("serviceInput");

year.textContent = new Date().getFullYear();

document.getElementById("ig").href = SOCIAL.instagram || "#";
document.getElementById("tg").href = SOCIAL.telegram || "#";
document.getElementById("wa").href = SOCIAL.whatsapp || "#";

function openModal(service = "") {
  modal.classList.add("isOpen");
  modal.setAttribute("aria-hidden", "false");
  serviceInput.value = service;
}

function closeModal() {
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
}

// Кнопка "Записаться" в шапке теперь ведет на dikidi.ru, обработчик не нужен

document.addEventListener("click", (e) => {
  if (e.target?.dataset?.close) closeModal();

  // кнопки "Записаться" в прайсе
  const btn = e.target.closest("button[data-service]");
  if (btn) openModal(btn.dataset.service || "");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

btnCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(PHONE);
    btnCopy.textContent = "Скопировано ✓";
    setTimeout(() => (btnCopy.textContent = "Скопировать телефон"), 1200);
  } catch {
    alert("Не удалось скопировать. Телефон: " + PHONE);
  }
});

leadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(leadForm).entries());

  // Быстрый вариант: открыть WhatsApp с предзаполненным текстом
  const text =
    `Запись в студию:%0A` +
    `Услуга: ${encodeURIComponent(data.service || "-")}%0A` +
    `Имя: ${encodeURIComponent(data.name || "-")}%0A` +
    `Телефон: ${encodeURIComponent(data.phone || "-")}%0A` +
    `Комментарий: ${encodeURIComponent(data.comment || "-")}`;

  // Если WhatsApp не нужен — заменим на Telegram/форму/CRM при хостинге
  const waUrl = `https://wa.me/${PHONE.replace("+","")}?text=${text}`;
  window.open(waUrl, "_blank", "noopener");

  closeModal();
  leadForm.reset();
});