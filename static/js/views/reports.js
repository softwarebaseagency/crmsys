window.Views = window.Views || {};

window.Views.reports = function (root) {
  "use strict";
  var t = I18n.t, D = DATA, F = Fmt;
  var cur = D.meta.currency;
  var open = D.openDeals();

  root.innerHTML =
    UI.pageHead({
      moduleNo: "06",
      title: "Reports",
      lede: "Forecast, source quality and stage movement reports for sales reviews.",
      actions:
        UI.select({ label: "Report pack", options: ["Board pack", "Sales manager", "Owner scorecard"] }) +
        UI.btn({ label: "Download PDF", icon: "download", demo: "pdf" }) +
        UI.btn({ label: t("act.print"), icon: "printer", variant: "primary", demo: "print" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "Report visuals are live and include table toggles. Exporting PDFs or scheduling report emails is disabled in the demo." }) +
    '<div class="forecast-strip">' +
      '<div class="forecast-strip__item"><span class="forecast-strip__label">Open value</span><span class="forecast-strip__value">' + F.money(D.totalDeals(open)) + "</span></div>" +
      '<div class="forecast-strip__item"><span class="forecast-strip__label">Weighted</span><span class="forecast-strip__value">' + F.money(D.weightedDeals(open)) + "</span></div>" +
      '<div class="forecast-strip__item"><span class="forecast-strip__label">Won this period</span><span class="forecast-strip__value">' + F.money(D.totalDeals(D.deals.filter(function (d) { return d.stage === "Won"; }))) + "</span></div>" +
      '<div class="forecast-strip__item"><span class="forecast-strip__label">Lost this period</span><span class="forecast-strip__value">' + F.money(D.totalDeals(D.deals.filter(function (d) { return d.stage === "Lost"; }))) + "</span></div>" +
    "</div>" +
    '<div class="grid grid--wide">' +
      UI.chartCard({ id: "reportForecast", title: "Forecast by month", sub: "Millions " + cur }) +
      UI.chartCard({ id: "reportStages", title: "Stage value ranking", sub: cur }) +
    "</div>" +
    '<div class="grid grid--2">' +
      UI.chartCard({ id: "reportOwners", title: "Owner portfolio", sub: cur }) +
      UI.chartCard({ id: "reportSources", title: "Source quality", sub: cur }) +
    "</div>";

  UI.mountCharts(root, {
    reportForecast: {
      type: "line",
      title: "Forecast by month",
      categories: D.charts.forecast.categories,
      series: D.charts.forecast.series,
      categoryLabel: "Month",
      summary: "Pipeline, weighted forecast and closed-won revenue are shown for the six-month sales planning period.",
      label: function (v) { return F.dec(v) + "M"; }
    },
    reportStages: {
      type: "bars",
      title: "Stage value ranking",
      rows: D.stageRows().sort(function (a, b) { return b.value - a.value; }),
      categoryLabel: "Stage",
      valueLabel: "Value",
      labelWidth: 112,
      label: F.money
    },
    reportOwners: {
      type: "bars",
      title: "Owner portfolio",
      rows: D.ownerRows().sort(function (a, b) { return b.value - a.value; }),
      categoryLabel: "Owner",
      valueLabel: "Value",
      labelWidth: 122,
      label: F.money
    },
    reportSources: {
      type: "donut",
      title: "Source quality",
      rows: D.charts.sources,
      categoryLabel: "Source",
      valueLabel: "Pipeline",
      centerValue: F.money(D.totalDeals(D.deals)),
      centerLabel: cur + " total",
      label: F.money
    }
  });
};
