/* Noetfield Shell (Burger + Active Links + Footer Year) */
/* Version: locked-2025.12.13 */

(function () {
  "use strict";

  function normPath(p) {
    if (!p) return "/";
    p = String(p).split("?")[0].split("#")[0];
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p.toLowerCase();
  }

  function setYear() {
    var y = document.getElementById("y");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function setActiveLinks() {
    var current = normPath(window.location.pathname);

    var selectors = [
      'nav[aria-label="Primary navigation"] a',
      "#mobilePanel a",
      "footer a"
    ].join(", ");

    var links = document.querySelectorAll(selectors);
    links.forEach(function (a) {
      // allow both absolute and relative; only style internal links
      var href = a.getAttribute("href") || "";
      if (!href) return;

      // normalize absolute URL to path if same-origin
      if (href.startsWith("http")) {
        try {
          var u = new URL(href, window.location.origin);
          if (u.origin !== window.location.origin) return;
          href = u.pathname || "/";
        } catch (e) { return; }
      }

      if (!href.startsWith("/")) return;

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
    if (burger.getAttribute("aria-expanded") !== "true") {
      panel.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("navOpen");
    } else {
      panel.hidden = false;
      document.body.classList.add("navOpen");
    }

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

    // Close when clicking outside the header region
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
