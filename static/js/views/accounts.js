window.Views = window.Views || {};

window.Views.accounts = function (root) {
  "use strict";
  var t = I18n.t, D = DATA, F = Fmt;
  var cur = D.meta.currency;

  function tone(health) {
    return health >= 70 ? "good" : health >= 55 ? "warn" : "crit";
  }

  root.innerHTML =
    UI.pageHead({
      moduleNo: "02",
      title: "Accounts",
      lede: "Company records with owners, revenue footprint, relationship health and open opportunities.",
      actions:
        UI.select({ label: "Segment", options: ["All segments", "Enterprise", "Growth", "Mid-market", "SMB"] }) +
        UI.btn({ label: t("act.export"), icon: "download", demo: "export" }) +
        UI.btn({ label: "New account", icon: "plus", variant: "primary", demo: "new" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "Use search, sorting and row drawers freely. Creating, merging and enriching accounts are production-only actions." }) +
    '<div class="grid grid--kpi">' +
      UI.stat({ label: "Accounts", icon: "building", value: F.int(D.accounts.length), unit: "records", note: "sample book" }) +
      UI.stat({ label: "Customer revenue", icon: "wallet", value: F.money(D.accounts.reduce(function (s, a) { return s + a.revenue; }, 0)), unit: cur, delta: 9.4, note: "booked and expansion" }) +
      UI.stat({ label: "Avg health", icon: "checkCircle", value: F.int(Math.round(D.accounts.reduce(function (s, a) { return s + a.health; }, 0) / D.accounts.length)), unit: "%", delta: 2.1, deltaUnit: " pt", note: "vs prior period" }) +
      UI.stat({ label: "Open deals", icon: "briefcase", value: F.int(D.openDeals().length), unit: "active", note: "across named accounts" }) +
    "</div>" +
    UI.card({ title: "Account book", sub: "Sorted, searchable and drawer-driven", flush: true,
      body: '<div id="accountTable"></div>' }) +
    '<div class="grid grid--wide">' +
      UI.chartCard({ id: "health", title: "Account health ranking", sub: "Relationship score" }) +
      UI.card({ title: "Demo workflow guardrails", sub: "What this module would do in production",
        body: '<div class="metric-list">' +
          '<div class="metric-list__row"><span class="metric-list__label">Account enrichment</span><span class="metric-list__value">Demo prompt</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Duplicate merge</span><span class="metric-list__value">Demo prompt</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Territory reassignment</span><span class="metric-list__value">Demo prompt</span></div>' +
        "</div>" }) +
    "</div>";

  UI.dataTable(root.querySelector("#accountTable"), {
    rows: D.accounts,
    pageSize: 8,
    searchPlaceholder: "Search company, sector, city or owner",
    defaultSort: "revenue", defaultDir: "desc",
    columns: [
      { field: "id", label: "Account", render: function (a) { return "<b>" + UI.esc(a.id) + "</b>"; } },
      { field: "name", label: "Company", wrap: true },
      { field: "sector", label: "Sector" },
      { field: "tier", label: "Tier" },
      { field: "owner", label: "Owner", render: function (a) { return UI.person(a.owner, null, "sm"); } },
      { field: "revenue", label: "Revenue (" + cur + ")", num: true, render: function (a) { return F.int(a.revenue); } },
      { field: "health", label: "Health", num: true, render: function (a) {
        return '<div style="min-width:92px">' + UI.track(a.health, tone(a.health)) +
          '<span class="text-2xs muted">' + a.health + "%</span></div>";
      } },
      { field: "state", label: "State", sortable: false, render: function (a) { return UI.statusPill(a.state); } },
      { field: "open", label: "", sortable: false, searchable: false,
        render: function () { return Icon("chevronRight", { size: 15, cls: "muted" }); } }
    ],
    onRow: function (a) {
      var deals = D.deals.filter(function (d) { return d.account === a.name; });
      var contacts = D.contacts.filter(function (c) { return c.account === a.name; });
      UI.openDrawer({
        eyebrow: a.id,
        title: a.name,
        sub: a.sector + " - " + a.city,
        body:
          '<div class="row-tight" style="margin-bottom:16px">' + UI.statusPill(a.state) +
            UI.pill(a.tier, "brand", "building") + UI.pill(a.health + "% health", tone(a.health), "checkCircle") + "</div>" +
          '<div class="grid grid--2">' +
            UI.card({ title: "Commercial profile", body:
              UI.field("Owner", a.owner) +
              UI.field("Annual value", F.int(a.revenue) + " " + cur) +
              UI.field("Open opportunities", deals.length) +
              UI.field("Last touch", a.lastTouch) }) +
            UI.card({ title: "Relationship map", body:
              UI.field("Contacts", contacts.map(function (c) { return c.name; }).join(", ")) +
              UI.field("Primary city", a.city) +
              UI.field("Sector", a.sector) +
              UI.field("Tier", a.tier) }) +
          "</div>",
        foot:
          UI.btn({ label: "Edit account", icon: "settings", variant: "primary", demo: "edit" }) +
          UI.btn({ label: "Open contacts", icon: "users", attrs: ' data-drawer-jump="contacts"' })
      });
    }
  });

  UI.mountCharts(root, {
    health: {
      type: "bars",
      title: "Account health ranking",
      rows: D.charts.accountHealth.slice().sort(function (a, b) { return b.value - a.value; }),
      categoryLabel: "Account",
      valueLabel: "Health score",
      labelWidth: 138,
      label: function (v) { return F.int(v) + "%"; }
    }
  });

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-drawer-jump]");
    if (b) { UI.closeDrawer(); App.go(b.getAttribute("data-drawer-jump")); }
  });
};
