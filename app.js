(function () {
  const cases = window.LCCS_CASES || {};
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const backToTop = document.querySelector("[data-back-top]");
  const casePanel = document.querySelector("#case-panel");
  const caseTabs = Array.from(document.querySelectorAll(".case-tab"));
  const prototypeCards = Array.from(document.querySelectorAll(".prototype-card"));
  const prototypeFrame = document.querySelector("#prototype-frame");
  const prototypeTitle = document.querySelector("#prototype-title");
  const prototypeOpen = document.querySelector("#prototype-open");
  const prototypeFallback = document.querySelector("#prototype-fallback");
  const observedCounters = new WeakSet();

  const layerLabels = {
    damage: "Damage Layer",
    publicCost: "Public Sector Cost",
    privateLoss: "Private / SME Loss",
    insurance: "Insurance Layer",
    household: "Household Impact",
    fieldOperation: "Field Operation Burden"
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function listMarkup(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function formatRunningNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    return number % 1 === 0 ? number.toLocaleString("th-TH") : number.toLocaleString("th-TH", { maximumFractionDigits: 2 });
  }

  function animateCounter(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const target = Number(element.dataset.count);
    const finalText = element.dataset.countFinal || formatRunningNumber(target);
    if (!Number.isFinite(target)) {
      element.textContent = finalText;
      return;
    }

    const duration = 900;
    const start = performance.now();
    const decimals = target % 1 === 0 ? 0 : 2;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      element.textContent = decimals ? current.toFixed(decimals) : Math.round(current).toLocaleString("th-TH");

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = finalText;
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 })
    : null;

  function observeCounters(scope) {
    scope.querySelectorAll("[data-count]").forEach((counter) => {
      if (observedCounters.has(counter)) return;
      observedCounters.add(counter);
      if (counterObserver) {
        counterObserver.observe(counter);
      } else {
        animateCounter(counter);
      }
    });
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("revealed"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  function setupActiveNav() {
    const links = Array.from(document.querySelectorAll(".nav-links a"));
    const sections = Array.from(document.querySelectorAll("[data-section]"));

    function setActive(id) {
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }

    if (!("IntersectionObserver" in window)) return;

    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, {
      rootMargin: "-34% 0px -55% 0px",
      threshold: [0.08, 0.2, 0.4, 0.6]
    });

    sections.forEach((section) => navObserver.observe(section));
  }

  function setupNavigation() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("open")) return;
      if (event.target.closest(".top-nav")) return;
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  function setupBackToTop() {
    if (!backToTop) return;
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 700);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function renderMetric(metric) {
    return `
      <article class="metric-card">
        <span>${escapeHtml(metric.label)}</span>
        <strong data-count="${escapeHtml(metric.count)}" data-count-final="${escapeHtml(metric.value)}">0</strong>
        <p>${escapeHtml(metric.unit)}</p>
        <small>${escapeHtml(metric.note)}</small>
      </article>
    `;
  }

  function renderLayers(data) {
    return Object.entries(layerLabels)
      .map(([key, label]) => {
        const items = data.layers[key] || [];
        return `
          <section class="layer-block">
            <h4>${escapeHtml(label)}</h4>
            ${listMarkup(items)}
          </section>
        `;
      })
      .join("");
  }

  function renderNorthExtras(data) {
    const years = Object.keys(data.years || {});
    if (!years.length) return "";

    const firstYear = years[0];
    return `
      <div class="series-patterns" aria-label="Recurring series patterns">
        ${(data.patterns || []).map((pattern) => `<span>${escapeHtml(pattern)}</span>`).join("")}
      </div>
      <div class="year-pills" role="tablist" aria-label="เลือกปีน้ำเหนือ">
        ${years.map((year, index) => `
          <button class="year-pill ${index === 0 ? "active" : ""}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" data-year="${escapeHtml(year)}">
            ${escapeHtml(year)}
          </button>
        `).join("")}
      </div>
      <div class="year-panel" id="year-panel">
        ${renderYearPanel(firstYear, data.years[firstYear])}
      </div>
    `;
  }

  function renderYearPanel(year, data) {
    return `
      <h4>${escapeHtml(year)}</h4>
      <div class="layers-grid">
        <section class="layer-block">
          <h4>Pattern</h4>
          ${listMarkup(data.pattern || [])}
        </section>
        <section class="layer-block">
          <h4>Track</h4>
          ${listMarkup(data.track || [])}
        </section>
      </div>
    `;
  }

  function setupYearPills(activeCase) {
    const pills = Array.from(casePanel.querySelectorAll(".year-pill"));
    const yearPanel = casePanel.querySelector("#year-panel");
    if (!pills.length || !yearPanel) return;

    function activateYear(button) {
      const year = button.dataset.year;
      pills.forEach((pill) => {
        const active = pill === button;
        pill.classList.toggle("active", active);
        pill.setAttribute("aria-selected", String(active));
      });
      yearPanel.innerHTML = renderYearPanel(year, activeCase.years[year]);
    }

    pills.forEach((pill, index) => {
      pill.addEventListener("click", () => activateYear(pill));
      pill.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % pills.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + pills.length) % pills.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = pills.length - 1;
        pills[nextIndex].focus();
        activateYear(pills[nextIndex]);
      });
    });
  }

  function renderCase(key) {
    const data = cases[key];
    if (!data || !casePanel) return;

    if (key === "compare") {
      casePanel.innerHTML = `
        <div class="case-header">
          <div>
            <h3>${escapeHtml(data.title)}</h3>
            <p>${escapeHtml(data.subtitle)}</p>
          </div>
        </div>
        <p>${escapeHtml(data.summary)}</p>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>กรณี</th>
                <th>จุดเด่นของภัย</th>
                <th>สิ่งที่เสียหายหลัก</th>
                <th>Data Layer ที่สำคัญที่สุด</th>
                <th>บทเรียนของ LCCS</th>
              </tr>
            </thead>
            <tbody>
              ${data.rows.map((row) => `
                <tr>
                  <td>${escapeHtml(row.case)}</td>
                  <td>${escapeHtml(row.feature)}</td>
                  <td>${escapeHtml(row.loss)}</td>
                  <td>${escapeHtml(row.layer)}</td>
                  <td>${escapeHtml(row.lesson)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="insight-box">${escapeHtml(data.closing)}</div>
      `;
      return;
    }

    casePanel.innerHTML = `
      <div class="case-header">
        <div>
          <h3>${escapeHtml(data.title)}</h3>
          <p>${escapeHtml(data.subtitle)}</p>
        </div>
        <div class="warning-label">${escapeHtml(data.warning)}</div>
      </div>
      <p>${escapeHtml(data.summary)}</p>
      <div class="metric-grid">
        ${(data.metrics || []).map(renderMetric).join("")}
      </div>
      ${key === "north2565to2568" ? renderNorthExtras(data) : ""}
      <div class="layers-grid">
        ${renderLayers(data)}
      </div>
      <div class="insight-box">${escapeHtml(data.insight)}</div>
    `;

    setupYearPills(data);
    observeCounters(casePanel);
  }

  function setupCaseTabs() {
    if (!caseTabs.length) return;

    function activateTab(tab) {
      const key = tab.dataset.case;
      caseTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      casePanel.setAttribute("aria-labelledby", tab.id);
      renderCase(key);
    }

    caseTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % caseTabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + caseTabs.length) % caseTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = caseTabs.length - 1;
        caseTabs[nextIndex].focus();
        activateTab(caseTabs[nextIndex]);
      });
    });

    renderCase(caseTabs[0].dataset.case);
  }

  function setPrototypeFrame(src, title) {
    if (!prototypeFrame || !prototypeTitle || !prototypeOpen || !prototypeFallback) return;

    prototypeTitle.textContent = title;
    prototypeOpen.href = src;
    prototypeFrame.title = `${title} preview`;
    prototypeFallback.hidden = true;
    prototypeFrame.hidden = false;

    const canCheck = window.location.protocol === "http:" || window.location.protocol === "https:";
    if (!canCheck) {
      prototypeFrame.src = src;
      return;
    }

    fetch(src, { method: "HEAD" })
      .then((response) => {
        if (!response.ok) throw new Error("missing prototype");
        prototypeFrame.src = src;
      })
      .catch(() => {
        prototypeFrame.removeAttribute("src");
        prototypeFrame.hidden = true;
        prototypeFallback.hidden = false;
      });
  }

  function setupPrototypePlayground() {
    if (!prototypeCards.length) return;

    prototypeCards.forEach((card) => {
      card.addEventListener("click", () => {
        prototypeCards.forEach((item) => item.classList.toggle("active", item === card));
        setPrototypeFrame(card.dataset.src, card.dataset.title);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupBackToTop();
    setupActiveNav();
    setupReveal();
    setupCaseTabs();
    setupPrototypePlayground();
    observeCounters(document);
  });
})();
