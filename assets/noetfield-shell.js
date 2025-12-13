/* Noetfield Shell (Burger + Active Links + Footer Year) */
/* Version: locked */

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
      var href = a.getAttribute("href") || "";
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
    }
    function closePanel() {
      burger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
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

    // Close when clicking outside the panel/burger
    document.addEventListener("click", function (e) {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      var t = e.target;
      if (panel.contains(t) || burger.contains(t)) return;
      closePanel();
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
