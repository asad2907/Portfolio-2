    try {
      const custom = JSON.parse(savedCustom);
      if (Array.isArray(custom) && custom.length === 6) {
        const normalized = custom.map(normalizeHex);
        setCssColors(normalized);
        applyColorsToUI(normalized);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.custom);
    }
  } else {
    applyScheme(savedScheme || "1");
  }

  document.querySelectorAll(".color-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyScheme(btn.dataset.scheme));
  });

  for (let i = 1; i <= 6; i += 1) {
    const picker = document.getElementById(`colorPicker${i}`);
    const value = document.getElementById(`colorValue${i}`);

    if (picker) {
      picker.addEventListener("input", (event) => {
        const next = normalizeHex(event.target.value);
        document.documentElement.style.setProperty(cssVarForIndex(i), next);
        if (value) value.value = next;
        saveCustomColors(getActiveColors());
      });
    }

    if (value) {
      value.addEventListener("click", () => {
        value.select();
      });
    }
  }

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.copy || "0");
      if (!idx) return;
      const value = document.getElementById(`colorValue${idx}`)?.value;
      if (value) copyText(value, btn);
    });
  });

  const exportBtn = document.getElementById("exportAllBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const colors = getActiveColors().map(normalizeHex);
      const text = colors.join(", ");
      copyText(text, exportBtn);
    });
  }
}

function initAdjusterPanel() {
  const panel = document.getElementById("colorAdjusterPanel");
  const toggleBtn = document.getElementById("toggleAdjusterBtn");
  const closeBtn = document.getElementById("closeAdjusterBtn");

  if (!panel || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!panel.classList.contains("open")) return;

    if (!panel.contains(target) && !toggleBtn.contains(target)) {
      panel.classList.remove("open");
    }
  });
}

function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const interactiveSelector = "a, button, input, textarea, [role='button']";
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "56px";
      cursor.style.height = "56px";
      cursor.style.borderWidth = "1px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.borderWidth = "2px";
    });
  });
}

function initLiquidBackground() {
  const css = document.createElement("style");
  css.textContent = `
    :root {
      --liquid-color-1: ${COLOR_SCHEMES[1][0]};
      --liquid-color-2: ${COLOR_SCHEMES[1][1]};
      --liquid-color-3: ${COLOR_SCHEMES[1][2]};
      --liquid-color-4: ${COLOR_SCHEMES[1][3]};
      --liquid-color-5: ${COLOR_SCHEMES[1][4]};
      --liquid-color-6: ${COLOR_SCHEMES[1][5]};
    }

    .bg {
      background:
        radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--liquid-color-1), transparent 62%), transparent 55%),
        radial-gradient(circle at 88% 16%, color-mix(in srgb, var(--liquid-color-2), transparent 62%), transparent 58%),
        radial-gradient(circle at 30% 72%, color-mix(in srgb, var(--liquid-color-3), transparent 64%), transparent 54%),
        radial-gradient(circle at 76% 82%, color-mix(in srgb, var(--liquid-color-4), transparent 68%), transparent 56%),
        linear-gradient(145deg, var(--liquid-color-5), #000 55%, var(--liquid-color-6));
      filter: saturate(115%);
    }
  `;
  document.head.appendChild(css);
}

document.addEventListener("DOMContentLoaded", () => {
  initLiquidBackground();
  initColorControls();
  initAdjusterPanel();
  initCustomCursor();
});
