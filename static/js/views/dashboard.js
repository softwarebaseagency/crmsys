window.Views = window.Views || {};

window.Views.dashboard = function (root) {
  "use strict";
  var t = I18n.t, D = DATA, F = Fmt;
  var cur = D.meta.currency;
  var open = D.openDeals();

  var kpis = [
    UI.stat({
      label: "Open pipeline", icon: "briefcase",
      value: F.money(D.totalDeals(open)), unit: cur,
      delta: 12.4, note: "vs last month",
      spark: Charts.spark(D.sparks.pipeline)
    }),
    UI.stat({
      label: "Weighted forecast", icon: "trend",
      value: F.money(D.weightedDeals(open)), unit: cur,
      delta: 8.1, note: "probability adjusted",
      spark: Charts.spark(D.sparks.weighted, { color: Charts.seriesColor(2) })
    }),
    UI.stat({
      label: "Win rate", icon: "award",
      value: "34", unit: "%",
      delta: 3.2, deltaUnit: " pt", note: "rolling 90 days",
      spark: Charts.spark(D.sparks.winrate, { color: Charts.seriesColor(3) })
    }),
    UI.stat({
      label: "Open support", icon: "message",
      value: F.int(D.supportOpen()), unit: "tickets",
      delta: -18, goodWhen: "down", note: "handoff workload",
      spark: Charts.spark(D.sparks.support, { color: Charts.seriesColor(5) })
    })
  ].join("");

  var alerts = '<ul class="list">' + D.alerts.map(function (a) {
    return '<li><span class="' + UI.cls(["pill", "pill--icon", a.tone && "pill--" + a.tone]) +
      '" style="margin-top:2px">' + Icon(a.icon, { size: 12 }) + "</span>" +
      '<span class="list__body"><span class="list__title">' + UI.esc(a.title) + "</span>" +
      '<span class="list__meta">' + UI.esc(a.meta) + "</span></span>" +
      '<span class="list__aside">' +
        UI.btn({ variant: "icon", size: "sm", icon: "chevronRight",
                 label: "Open related module", attrs: ' data-jump="pipeline"' }) +
      "</span></li>";
  }).join("") + "</ul>";

  var next = D.openDeals().slice(0, 5).map(function (d) {
    return '<li><span class="list__body"><span class="list__title">' +
      UI.esc(d.account) + "</span><span class=\"list__meta\">" +
      UI.esc(d.nextStep) + " - " + UI.ltr(d.closeDate) + "</span></span>" +
      '<span class="list__aside">' + UI.pill(F.money(d.amount), "", "wallet") + "</span></li>";
  }).join("");

  root.innerHTML =
    UI.pageHead({
      moduleNo: "00",
      title: "Dashboard",
      lede: "A compact read on pipeline value, forecast confidence, account health and follow-up risk.",
      actions:
        UI.select({ label: "Period", options: ["This quarter", "This month", "Last 90 days"] }) +
        UI.btn({ label: t("act.export"), icon: "download", demo: "export" }) +
        UI.btn({ label: t("act.print"), icon: "printer", variant: "primary", demo: "print" })
    }) +
    UI.notice({
      tone: "brand", icon: "info",
      title: t("demo.readOnly"),
      text: "This CRM is a showcase demo. Tables, drawers and chart toggles are usable; saving, importing and messaging are intentionally disabled.",
      aside: '<span class="badge">' + Icon("clock", { size: 11 }) + " " +
        UI.esc(t("t.lastUpdated")) + " " + UI.ltr(D.meta.updated) + "</span>"
    }) +
    '<div class="grid grid--kpi">' + kpis + "</div>" +
    '<div class="grid grid--wide">' +
      UI.chartCard({ id: "forecast", title: "Forecast trend", sub: "Millions " + cur + " - July to December" }) +
      UI.chartCard({ id: "stageMix", title: "Open value by stage", sub: cur }) +
    "</div>" +
    '<div class="grid grid--side">' +
      UI.card({ title: "Needs attention", sub: "Ranked by deal risk and handoff urgency", flush: true, body: alerts }) +
      UI.card({ title: "Next best actions", sub: "Open opportunities with scheduled next steps", flush: true,
        body: '<ul class="list">' + next + "</ul>",
        foot: UI.btn({ label: "Open pipeline", size: "sm", icon: "arrowRight", attrs: ' data-jump="pipeline"' }) }) +
    "</div>";

  UI.mountCharts(root, {
    forecast: {
      type: "line",
      title: "Forecast trend",
      categories: D.charts.forecast.categories,
      series: D.charts.forecast.series,
      categoryLabel: "Month",
      summary: "The open pipeline and weighted forecast climb steadily into December, while closed-won revenue is recorded through September.",
      label: function (v) { return F.dec(v) + "M"; }
    },
    stageMix: {
      type: "donut",
      title: "Open value by stage",
      rows: D.stageRows(),
      categoryLabel: "Stage",
      valueLabel: "Value",
      centerValue: F.money(D.totalDeals(open)),
      centerLabel: cur + " open",
      label: F.money
    }
  });

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-jump]");
    if (b) { App.go(b.getAttribute("data-jump")); }
  });
};
