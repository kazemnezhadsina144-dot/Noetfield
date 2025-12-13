/* Noetfield Shell (Burger + Active Links + Footer Year) */
/* Version: locked-2025.12.13+gate-intake+faq+offers */

(function () {
  "use strict";

  function normPath(p) {
    if (!p) return "/";
    p = String(p).split("?")[0].split("#")[0];
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p.toLowerCase();
  }

  function toInternalPath(href) {
    if (!href) return null;

    // Normalize absolute URL to path if same-origin
    if (href.startsWith("http")) {
      try {
        var u = new URL(href, window.location.origin);
        if (u.origin !== window.location.origin) return null;
        return u.pathname || "/";
      } catch (e) {
        return null;
      }
    }

    // Only style internal absolute-path links
    if (!href.startsWith("/")) return null;
    return href;
  }

  function setYear() {
    var y = document.getElementById("y");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function setActiveLinks() {
    var current = normPath(window.location.pathname);

    // Active state ONLY for:
    // - Header primary nav links
    // - Mobile panel links
    // - Footer mini nav links
    // (NOT footerTop box links)
    var selectors = [
      'nav[aria-label="Primary navigation"] a',
      "#mobilePanel a",
      "footer .footerMiniNav a"
    ].join(", ");

    var links = document.querySelectorAll(selectors);
    links.forEach(function (a) {
      var hrefRaw = a.getAttribute("href") || "";
      var href = toInternalPath(hrefRaw);
      if (!href) return;

      var target = normPath(href);
      var isActive =
        (target === "/" && current === "/") ||
        (target !== "/" && (current === target || current.startsWith(target + "/")));

      if (isActive) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  function initBurger() {
    var burger = document.getElementById("burger");
    var panel = document.getElementById("mobilePanel");
    if (!burger || !panel) return;

    function openPanel() {
      burger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      document.body.classList.add("navOpen");
    }
    function closePanel() {
      burger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      document.body.classList.remove("navOpen");
    }
    function toggle() {
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) closePanel();
      else openPanel();
    }

    // Initial safety
    burger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    document.body.classList.remove("navOpen");

    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });

    // Close on Esc
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closePanel();
      }
    });

    // Close when clicking outside header
    document.addEventListener("click", function (e) {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      var withinHeader = !!(e.target && e.target.closest && e.target.closest("header"));
      if (!withinHeader) closePanel();
    });

    // Close after clicking a mobile link
    panel.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a) closePanel();
    });

    // Close on resize back to desktop width
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1140 && burger.getAttribute("aria-expanded") === "true") {
        closePanel();
      }
    });
  }

  function boot() {
    setYear();
    setActiveLinks();
    initBurger();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
