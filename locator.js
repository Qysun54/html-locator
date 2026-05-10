// HTML Locator - toggle with the L button, hover to preview, press C to copy.
(function () {
  if (window.__htmlLocatorLoaded) return;
  window.__htmlLocatorLoaded = true;

  var active = false;
  var indicator = null;
  var pathBar = null;
  var lastHighlighted = null;
  var toastTimer = null;
  var toggleButton = document.createElement("button");

  toggleButton.id = "locator-toggle";
  toggleButton.type = "button";
  toggleButton.textContent = "L";
  toggleButton.title = "Toggle locator mode";
  toggleButton.setAttribute("aria-label", "Toggle locator mode");
  toggleButton.style.cssText = [
    "position:fixed",
    "bottom:16px",
    "left:16px",
    "z-index:2147483647",
    "width:36px",
    "height:36px",
    "border:0",
    "border-radius:50%",
    "background:#2563eb",
    "color:#fff",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "font:700 15px/1 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
    "cursor:pointer",
    "box-shadow:0 2px 8px rgba(37,99,235,.4)",
    "transition:transform .15s,background .15s",
    "user-select:none"
  ].join(";");

  toggleButton.addEventListener("mouseenter", function () {
    toggleButton.style.transform = "scale(1.08)";
  });

  toggleButton.addEventListener("mouseleave", function () {
    toggleButton.style.transform = "";
  });

  toggleButton.addEventListener("click", toggle);

  if (document.body) {
    document.body.appendChild(toggleButton);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.appendChild(toggleButton);
    });
  }

  function buildPath(element) {
    var parts = [];
    var current = element;

    while (current && current !== document.body) {
      var section = current.getAttribute && current.getAttribute("data-section");
      if (section) {
        parts.unshift(section);
      } else if (current.id && current.id.indexOf("locator") !== 0) {
        parts.unshift("#" + current.id);
      }
      current = current.parentElement;
    }

    var text = element.textContent && element.textContent.trim().replace(/\s+/g, " ");
    if (text && text.length < 40 && element.children.length === 0) {
      parts.push('"' + text + '"');
    } else if (parts.length === 0) {
      var tag = element.tagName.toLowerCase();
      var className = element.className ? "." + String(element.className).split(/\s+/)[0] : "";
      parts.push(tag + className);
    }

    return parts.join(" > ");
  }

  function showToast(message, isError) {
    var existing = document.getElementById("locator-toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.id = "locator-toast";
    toast.textContent = message;
    toast.style.cssText = [
      "position:fixed",
      "top:50px",
      "right:16px",
      "z-index:2147483647",
      "max-width:min(520px,calc(100vw - 32px))",
      "background:" + (isError ? "#dc2626" : "#16a34a"),
      "color:#fff",
      "padding:8px 14px",
      "border-radius:6px",
      "font:500 13px/1.4 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "pointer-events:none",
      "transition:opacity .3s",
      "box-shadow:0 8px 24px rgba(15,23,42,.18)"
    ].join(";");

    document.body.appendChild(toast);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2000);
  }

  function isLocatorElement(element) {
    return element.id && element.id.indexOf("locator") === 0;
  }

  function onMouseOver(event) {
    if (!active) return;

    var element = event.target;
    if (isLocatorElement(element)) return;

    clearHighlight();
    element.style.outline = "2px solid rgba(37,99,235,.7)";
    element.style.outlineOffset = "-1px";
    lastHighlighted = element;

    pathBar.textContent = buildPath(element);
    pathBar.style.display = "block";
  }

  function onMouseOut() {
    if (!active) return;
    clearHighlight();
  }

  function onKeyDown(event) {
    if (!active || !lastHighlighted) return;
    if (event.key !== "c" && event.key !== "C") return;

    var path = buildPath(lastHighlighted);
    copyText(path);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Copied: " + text);
      }).catch(function () {
        fallbackCopy(text);
      });
      return;
    }

    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.cssText = "position:fixed;top:-999px;left:-999px";
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      showToast("Copied: " + text);
    } catch (error) {
      showToast("Copy failed. Path: " + text, true);
    } finally {
      input.remove();
    }
  }

  function clearHighlight() {
    if (!lastHighlighted) return;
    lastHighlighted.style.outline = "";
    lastHighlighted.style.outlineOffset = "";
    lastHighlighted = null;
  }

  function toggle() {
    active = !active;

    if (active) {
      toggleButton.style.background = "#dc2626";
      toggleButton.textContent = "X";

      indicator = document.createElement("div");
      indicator.id = "locator-indicator";
      indicator.textContent = "Locator mode: hover to preview, press C to copy";
      indicator.style.cssText = [
        "position:fixed",
        "top:8px",
        "right:16px",
        "z-index:2147483646",
        "background:#2563eb",
        "color:#fff",
        "padding:5px 12px",
        "border-radius:6px",
        "font:500 12px/1.4 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
        "pointer-events:none",
        "box-shadow:0 2px 8px rgba(37,99,235,.3)"
      ].join(";");
      document.body.appendChild(indicator);

      pathBar = document.createElement("div");
      pathBar.id = "locator-pathbar";
      pathBar.style.cssText = [
        "position:fixed",
        "bottom:0",
        "left:0",
        "right:0",
        "z-index:2147483646",
        "background:#1e293b",
        "color:#e2e8f0",
        "padding:8px 16px",
        "font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
        "display:none",
        "pointer-events:none",
        "box-sizing:border-box"
      ].join(";");
      document.body.appendChild(pathBar);

      document.addEventListener("mouseover", onMouseOver, true);
      document.addEventListener("mouseout", onMouseOut, true);
      document.addEventListener("keydown", onKeyDown, true);
    } else {
      toggleButton.style.background = "#2563eb";
      toggleButton.textContent = "L";

      if (indicator) indicator.remove();
      if (pathBar) pathBar.remove();
      indicator = null;
      pathBar = null;
      clearHighlight();

      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mouseout", onMouseOut, true);
      document.removeEventListener("keydown", onKeyDown, true);
    }
  }
})();
