/* /assets/ai-callops.js — v1.0
   AI CallOps landing system
   - RID-aware mailto subject hardening
   - Simple ROI calculator (optional per page)
   - “Copy summary” for internal forwarding
*/
(function () {
  "use strict";

  function qs(sel, root){ try { return (root || document).querySelector(sel); } catch(_) { return null; } }
  function qsa(sel, root){ try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch(_) { return []; } }

  function safeNum(x, fallback){
    var n = Number(x);
    return Number.isFinite(n) ? n : (fallback || 0);
  }

  function formatMoney(n){
    try {
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
    } catch(_) {
      return String(Math.round(n));
    }
  }

  function withRIDInMailto(rid){
    qsa('a[data-rid-mail]').forEach(function(a){
      var href = (a.getAttribute("href") || "").trim();
      if (!href || !href.toLowerCase().startsWith("mailto:")) return;

      var parts = href.split("?");
      var base = parts[0];
      var params = new URLSearchParams(parts[1] || "");
      var subj = (params.get("subject") || "").trim();

      if (subj && subj.indexOf("RID:") !== -1) return;

      var suffix = rid ? (" [RID: " + rid + "]") : "";
      params.set("subject", (subj || "AI CallOps — Intake") + suffix);

      a.setAttribute("href", base + "?" + params.toString());
    });
  }

  function initCopySummary(rid){
    qsa("[data-copy-summary]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var targetSel = btn.getAttribute("data-copy-summary");
        var el = targetSel ? qs(targetSel) : null;
        var text = el ? (el.textContent || "").trim() : "";
        if (!text) return;

        var out = text + (rid ? ("\n\nRID: " + rid) : "");
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(out).then(function(){
            btn.setAttribute("data-copied", "1");
            setTimeout(function(){ btn.removeAttribute("data-copied"); }, 900);
          }).catch(function(){});
        }
      });
    });
  }

  function initCalc(){
    qsa("[data-callops-calc]").forEach(function(form){
      var out = qs("[data-calc-out]", form.parentNode) || qs("[data-calc-out]");
      if (!out) return;

      function recalc(){
        var missed = safeNum((qs('input[name="missed_calls"]', form) || {}).value, 0);
        var avg = safeNum((qs('input[name="avg_ticket"]', form) || {}).value, 0);
        var close = safeNum((qs('input[name="close_rate"]', form) || {}).value, 0) / 100;
        var days = safeNum((qs('input[name="days_month"]', form) || {}).value, 22);

        var recoveredJobs = missed * close * days;
        var recoveredRevenue = recoveredJobs * avg;

        out.innerHTML =
          "<div><strong>Estimated recovered revenue:</strong> " + formatMoney(recoveredRevenue) + " / month</div>" +
          "<div style='margin-top:6px;'><strong>Estimated recovered jobs:</strong> " + formatMoney(recoveredJobs) + " / month</div>" +
          "<div style='margin-top:6px; color:var(--muted2);'>Assumption: recovered = missed calls × close rate × days. Use conservative values.</div>";
      }

      form.addEventListener("input", recalc);
      recalc();
    });
  }

  function boot(rid){
    withRIDInMailto(rid);
    initCopySummary(rid);
    initCalc();
  }

  window.addEventListener("nf:shell:ready", function(ev){
    var rid = (ev && ev.detail && ev.detail.rid) ? String(ev.detail.rid) : "";
    boot(rid);
  });

  // Fallback if shell event missed
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){
      var rid = (window.__nf && window.__nf.rid) ? String(window.__nf.rid) : "";
      boot(rid);
    });
  } else {
    var ridNow = (window.__nf && window.__nf.rid) ? String(window.__nf.rid) : "";
    boot(ridNow);
  }
})();
