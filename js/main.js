document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initPortfolioFilters();
  initCopyButtons();
  initContactForm();
});

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "CLOSE" : "MENU";
  });
}

function initPortfolioFilters() {
  const pills = document.querySelectorAll(".filter-pill[data-filter]");
  const cards = document.querySelectorAll(".project-card[data-tags]");
  if (!pills.length || !cards.length) return;

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.getAttribute("data-filter");
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      cards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").split(",");
        const match = filter === "all" || tags.includes(filter);
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

function initCopyButtons() {
  document.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = "COPIED!";
        setTimeout(() => {
          btn.textContent = original;
        }, 1600);
      } catch {
        btn.textContent = "COPY FAILED";
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusBox = document.getElementById("form-status");
  if (!form || !statusBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "Portfolio Inquiry").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      showStatus(statusBox, "Please fill in your name, email, and message.", "info");
      return;
    }

    const endpoint = form.getAttribute("data-endpoint") || "";
    const accessKey = String(formData.get("access_key") || "").trim();

    // If a live Web3Forms/Formspree endpoint & key are configured, submit via fetch
    if (endpoint && (!endpoint.includes("web3forms") || (accessKey && accessKey !== "YOUR_WEB3FORMS_ACCESS_KEY"))) {
      try {
        showStatus(statusBox, "Sending message...", "info");
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          form.reset();
          showStatus(statusBox, "Message sent! Thanks for reaching out — I'll reply soon.", "success");
          return;
        }
      } catch {
        // Fall through to mailto fallback
      }
    }

    // Automatic mailto: fallback
    const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject}`);
    const mailtoBody = encodeURIComponent(`Hi Marqus,\n\nFrom: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:mrqskynn@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    showStatus(
      statusBox,
      "Opening your email client to send directly to mrqskynn@gmail.com.",
      "info"
    );
  });
}

function showStatus(el, text, type) {
  el.textContent = text;
  el.className = `form-status show ${type}`;
}
