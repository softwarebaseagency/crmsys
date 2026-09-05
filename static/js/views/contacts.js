window.Views = window.Views || {};

window.Views.contacts = function (root) {
  "use strict";
  var t = I18n.t, D = DATA;

  function warmthTone(w) {
    return w === "Hot" ? "critical" : w === "Warm" ? "warning" : "";
  }

  root.innerHTML =
    UI.pageHead({
      moduleNo: "03",
      title: "Contacts",
      lede: "People records with ownership, account context and communication readiness.",
      actions:
        UI.select({ label: "Warmth", options: ["All warmth", "Hot", "Warm", "Cold"] }) +
        UI.btn({ label: "Import CSV", icon: "download", demo: "import" }) +
        UI.btn({ label: "New contact", icon: "plus", variant: "primary", demo: "new" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "Contact rows open usable profiles. Sending email, dialing and syncing contacts show demo prompts." }) +
    '<div class="grid grid--3">' +
      UI.card({ title: "Follow-up queue", sub: "Next actions by warmth",
        body: '<div class="metric-list">' +
          '<div class="metric-list__row"><span class="metric-list__label">Hot contacts</span><span class="metric-list__value">' + D.contacts.filter(function (c) { return c.warmth === "Hot"; }).length + "</span></div>" +
          '<div class="metric-list__row"><span class="metric-list__label">Warm contacts</span><span class="metric-list__value">' + D.contacts.filter(function (c) { return c.warmth === "Warm"; }).length + "</span></div>" +
          '<div class="metric-list__row"><span class="metric-list__label">Scheduled touches</span><span class="metric-list__value">' + D.contacts.filter(function (c) { return c.state === "scheduled"; }).length + "</span></div>" +
        "</div>" }) +
      UI.card({ title: "Communication tools", sub: "Production actions are gated",
        body: '<div class="row-tight">' +
          UI.btn({ label: "Bulk email", icon: "mail", demo: "email" }) +
          UI.btn({ label: "Call list", icon: "phone", demo: "call" }) +
          UI.btn({ label: "Sync", icon: "refresh", demo: "sync" }) +
        "</div>" }) +
      UI.card({ title: "Data hygiene", sub: "Sample validation summary",
        body: '<div class="metric-list">' +
          '<div class="metric-list__row"><span class="metric-list__label">Complete profiles</span><span class="metric-list__value">86%</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Missing titles</span><span class="metric-list__value">2</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Duplicates flagged</span><span class="metric-list__value">1</span></div>' +
        "</div>" }) +
    "</div>" +
    UI.card({ title: "All contacts", sub: "Searchable people index", flush: true,
      body: '<div id="contactTable"></div>' });

  UI.dataTable(root.querySelector("#contactTable"), {
    rows: D.contacts,
    pageSize: 8,
    searchPlaceholder: "Search name, title, account, email or phone",
    defaultSort: "lastTouch", defaultDir: "desc",
    columns: [
      { field: "name", label: "Name", wrap: true, render: function (c) { return UI.person(c.name, c.title, "sm"); } },
      { field: "account", label: "Account", wrap: true },
      { field: "email", label: "Email", wrap: true },
      { field: "phone", label: "Phone", render: function (c) { return UI.ltr(c.phone); } },
      { field: "owner", label: "Owner" },
      { field: "warmth", label: "Warmth", render: function (c) { return UI.pill(c.warmth, warmthTone(c.warmth), "dot"); } },
      { field: "state", label: "State", sortable: false, render: function (c) { return UI.statusPill(c.state); } },
      { field: "open", label: "", sortable: false, searchable: false,
        render: function () { return Icon("chevronRight", { size: 15, cls: "muted" }); } }
    ],
    onRow: function (c) {
      UI.openDrawer({
        eyebrow: c.id,
        title: c.name,
        sub: c.title + " - " + c.account,
        body:
          '<div class="row-tight" style="margin-bottom:16px">' +
            UI.pill(c.warmth, warmthTone(c.warmth), "dot") + UI.statusPill(c.state) + "</div>" +
          '<div class="grid grid--2">' +
            UI.card({ title: "Contact details", body:
              UI.field("Email", c.email) +
              UI.field("Phone", c.phone) +
              UI.field("Owner", c.owner) +
              UI.field("Last touch", c.lastTouch) }) +
            UI.card({ title: "CRM context", body:
              UI.field("Account", c.account) +
              UI.field("Title", c.title) +
              UI.field("Warmth", c.warmth) +
              UI.field("Status", t("s." + c.state)) }) +
          "</div>",
        foot:
          UI.btn({ label: "Send email", icon: "mail", variant: "primary", demo: "email" }) +
          UI.btn({ label: "Log call", icon: "phone", demo: "call" })
      });
    }
  });
};
