window.Views = window.Views || {};

window.Views.pipeline = function (root) {
  "use strict";
  var t = I18n.t, D = DATA, F = Fmt;
  var cur = D.meta.currency;

  function stageTone(stage) {
    return stage === "Negotiation" ? "serious" :
      stage === "Proposal" ? "warning" :
      stage === "Demo" ? "info" :
      stage === "Qualified" ? "good" : "";
  }

  function openDeal(d) {
    var account = D.accountByName(d.account) || {};
    UI.openDrawer({
      eyebrow: d.id,
      title: d.account,
      sub: d.stage + " - " + d.owner,
      body:
        '<div class="row-tight" style="margin-bottom:16px">' +
          UI.statusPill(d.state) +
          UI.pill(F.money(d.amount) + " " + cur, "", "wallet") +
          UI.pill(d.probability + "% probability", stageTone(d.stage), "trend") +
        "</div>" +
        '<div class="grid grid--2">' +
          UI.card({ title: "Opportunity", body:
            UI.field("Contact", d.contact) +
            UI.field("Account", d.account, account.sector || "") +
            UI.field("Close date", d.closeDate) +
            UI.field("Lead source", d.source) }) +
          UI.card({ title: "Next step", body:
            UI.field("Owner", d.owner) +
            UI.field("Next action", d.nextStep) +
            UI.field("Weighted value", F.int(Math.round(d.amount * d.probability / 100)) + " " + cur) +
            UI.field("Account health", account.health ? account.health + "%" : "") }) +
        "</div>",
      foot:
        UI.btn({ label: "Log activity", icon: "calendarCheck", variant: "primary", demo: "activity" }) +
        UI.btn({ label: "Send email", icon: "mail", demo: "email" })
    });
  }

  var board = '<div class="pipeline">' + D.stages.map(function (stage) {
    var rows = D.deals.filter(function (d) { return d.stage === stage; });
    return '<section class="pipeline__lane" aria-label="' + UI.esc(stage) + ' stage">' +
      '<div class="pipeline__head"><span><span class="pipeline__title">' + UI.esc(stage) + "</span>" +
      '<span class="pipeline__meta">' + rows.length + " deals - " + F.money(D.totalDeals(rows)) + " " + cur + "</span></span>" +
      UI.pill(rows.length + "", stageTone(stage), "briefcase") + "</div>" +
      rows.map(function (d) {
        return '<button type="button" class="dealcard" data-deal="' + UI.esc(d.id) + '">' +
          '<span class="dealcard__top"><span><span class="dealcard__title">' + UI.esc(d.account) + "</span>" +
          '<span class="dealcard__meta">' + UI.esc(d.contact) + " - " + UI.esc(d.owner) + "</span></span>" +
          '<span class="dealcard__value">' + F.money(d.amount) + "</span></span>" +
          '<span>' + UI.track(d.probability, d.probability > 65 ? "good" : d.probability > 40 ? "warn" : "crit") + "</span>" +
          '<span class="dealcard__meta">' + UI.esc(d.nextStep) + "</span>" +
        "</button>";
      }).join("") + "</section>";
  }).join("") + "</div>";

  root.innerHTML =
    UI.pageHead({
      moduleNo: "01",
      title: "Deal Pipeline",
      lede: "A board and table view of every live opportunity, from first lead through negotiation.",
      actions:
        UI.select({ label: "Owner", options: ["All owners", "Lana Aziz", "Hemin Barzan", "Darin Qadir", "Shaho Karim"] }) +
        UI.btn({ label: "Import leads", icon: "download", demo: "import" }) +
        UI.btn({ label: "New deal", icon: "plus", variant: "primary", demo: "new" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "Deal cards and table rows open detail drawers. Dragging, saving and lead import are disabled in this demo." }) +
    board +
    UI.card({ title: "All opportunities", sub: D.deals.length + " sample deals with weighted forecast values",
      flush: true, body: '<div id="dealTable"></div>' }) +
    '<div class="grid grid--wide">' +
      UI.chartCard({ id: "ownerValue", title: "Open value by owner", sub: cur }) +
      UI.chartCard({ id: "sourceMix", title: "Deal source mix", sub: cur }) +
    "</div>";

  UI.dataTable(root.querySelector("#dealTable"), {
    rows: D.deals,
    pageSize: 8,
    searchPlaceholder: "Search account, contact, owner or stage",
    defaultSort: "amount", defaultDir: "desc",
    columns: [
      { field: "id", label: "Deal", render: function (d) { return "<b>" + UI.esc(d.id) + "</b>"; } },
      { field: "account", label: "Account", wrap: true },
      { field: "stage", label: "Stage", render: function (d) { return UI.pill(d.stage, stageTone(d.stage), "briefcase"); } },
      { field: "owner", label: "Owner", render: function (d) { return UI.person(d.owner, null, "sm"); } },
      { field: "amount", label: "Value (" + cur + ")", num: true, render: function (d) { return F.int(d.amount); } },
      { field: "probability", label: "Prob.", num: true, render: function (d) { return d.probability + "%"; } },
      { field: "closeDate", label: "Close", render: function (d) { return UI.ltr(d.closeDate); } },
      { field: "state", label: "State", sortable: false, render: function (d) { return UI.statusPill(d.state); } },
      { field: "open", label: "", sortable: false, searchable: false,
        render: function () { return Icon("chevronRight", { size: 15, cls: "muted" }); } }
    ],
    onRow: openDeal
  });

  UI.mountCharts(root, {
    ownerValue: {
      type: "bars",
      title: "Open value by owner",
      rows: D.ownerRows().sort(function (a, b) { return b.value - a.value; }),
      categoryLabel: "Owner",
      valueLabel: "Open value",
      labelWidth: 122,
      label: F.money
    },
    sourceMix: {
      type: "donut",
      title: "Deal source mix",
      rows: D.charts.sources,
      categoryLabel: "Source",
      valueLabel: "Pipeline",
      centerValue: F.money(D.totalDeals(D.deals)),
      centerLabel: cur + " total",
      label: F.money
    }
  });

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-deal]");
    if (!b) { return; }
    var row = D.deals.filter(function (d) { return d.id === b.getAttribute("data-deal"); })[0];
    if (row) { openDeal(row); }
  });
};
