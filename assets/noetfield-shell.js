/* Noetfield Shell (Inject Header/Footer + Burger + Active Links + Footer Year) */
/* Version: locked-2025.12.13+inject-partials */

(function () {
  "use strict";

  var SHELL_VERSION = "2025.12.13";
  var PARTIALS_BASE = "/assets/partials";

  function normPath(p) {
    if (!p) return "/";
    p = String(p).split("?")[0].split("#")[0];
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p.toLowerCase();
  }

  function toInternalPath(href) {
    if (!href) return null;

    if (href.startsWith("http")) {
      try {
        var u = new URL(href, window.location.origin);
        if (u.origin !== window.location.origin) return null;
        return u.pathname || "/";
      } catch (e) {
        return null;
      }
    }

    if (!href.startsWith("/")) return null;
    return href;
  }

  function setYear() {
    var y = document.getElementById("y");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function setActiveLinks() {
    var current = normPath(window.location.pathname);

    var selectors = [
      '#nfHeader nav[aria-label="Primary navigation"] a',
      "#nfHeader #mobilePanel a",
      "#nfFooter .footerMiniNav a"
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

    burger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    document.body.classList.remove("navOpen");

    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closePanel();
      }
    });

    document.addEventListener("click", function (e) {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      var withinHeader = !!(e.target && e.target.closest && e.target.closest("#nfHeader"));
      if (!withinHeader) closePanel();
    });

    panel.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a) closePanel();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1140 && burger.getAttribute("aria-expanded") === "true") {
        closePanel();
      }
    });
  }

  function ensureFeedbackTab() {
    var p = normPath(window.location.pathname);
    if (p === "/feedback" || p.startsWith("/feedback/")) return;
    if (document.querySelector(".feedbackTab")) return;

    var a = document.createElement("a");
    a.className = "feedbackTab";
    a.href = "/feedback/";
    a.setAttribute("aria-label", "Open feedback");

    var spark = document.createElement("span");
    spark.className = "spark";
    spark.setAttribute("aria-hidden", "true");

    a.appendChild(spark);
    a.appendChild(document.createTextNode("Feedback"));
    document.body.appendChild(a);
  }

  async function injectOne(targetId, partialName) {
    var el = document.getElementById(targetId);
    if (!el) return;

    // اگر صفحه قدیمی است و داخلش markup دارد، دست نزن
    var hasMarkup = el.children && el.children.length > 0;
    if (hasMarkup) return;

    var url = PARTIALS_BASE + "/" + partialName + "?v=" + encodeURIComponent(SHELL_VERSION);

    try {
      var res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) return;
      var html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      // silent fail (static pages should still render content)
    }
  }

  async function injectShell() {
    await injectOne("nfHeader", "header.html");
    await injectOne("nfFooter", "footer.html");
  }

  async function boot() {
    await injectShell();

    // after injection
    setYear();
    setActiveLinks();
    initBurger();
    ensureFeedbackTab();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { boot(); });
  } else {
    boot();
  }
})();
