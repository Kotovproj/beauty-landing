const PHONE = "+79812795722"; // поменяй на реальный
const SOCIAL = {
  instagram: "https://instagram.com/",   // вставь ссылку или оставь #
  telegram:  "https://t.me/gala_studio",
  whatsapp:  "https://wa.me/79812795722" // номер без +, без пробелов
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

const slider = document.querySelector("[data-slider]");
if (slider) {
  const track = slider.querySelector(".gallery__track");
  const slides = Array.from(slider.querySelectorAll(".gallery__slide"));
  const dots = Array.from(slider.querySelectorAll("[data-slide]"));

  if (track && slides.length > 1) {
    let index = 0;
    let timerId = null;

    const setActive = (nextIndex) => {
      index = nextIndex;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    };

    const start = () => {
      timerId = setInterval(() => {
        const next = (index + 1) % slides.length;
        setActive(next);
      }, 4200);
    };

    const stop = () => {
      if (timerId) clearInterval(timerId);
      timerId = null;
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const nextIndex = Number.parseInt(dot.dataset.slide, 10) || 0;
        setActive(nextIndex);
        stop();
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    setActive(0);
    start();
  }
}

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
