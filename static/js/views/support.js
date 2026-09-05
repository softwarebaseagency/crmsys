window.Views = window.Views || {};

window.Views.support = function (root) {
  "use strict";
  var t = I18n.t, D = DATA;

  function priorityTone(p) {
    return p === "High" ? "critical" : p === "Medium" ? "warning" : "";
  }

  root.innerHTML =
    UI.pageHead({
      moduleNo: "05",
      title: "Support",
      lede: "Customer issues connected back to accounts, deals and onboarding risk.",
      actions:
        UI.select({ label: "Priority", options: ["All priorities", "High", "Medium", "Low"] }) +
        UI.btn({ label: "New ticket", icon: "plus", variant: "primary", demo: "ticket" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "Ticket browsing is enabled. Creating replies, attachments and SLA changes are blocked with demo prompts." }) +
    '<div class="grid grid--kpi">' +
      UI.stat({ label: "Open tickets", icon: "message", value: DATA.supportOpen(), unit: "active", note: "excluding completed" }) +
      UI.stat({ label: "Escalated", icon: "alert", value: D.tickets.filter(function (x) { return x.state === "escalated"; }).length, unit: "ticket", note: "commercial risk" }) +
      UI.stat({ label: "High priority", icon: "clock", value: D.tickets.filter(function (x) { return x.priority === "High"; }).length, unit: "tickets", note: "SLA watched" }) +
      UI.stat({ label: "Resolved", icon: "checkCircle", value: D.tickets.filter(function (x) { return x.state === "completed"; }).length, unit: "today", delta: 16, note: "vs yesterday" }) +
    "</div>" +
    UI.card({ title: "Support queue", sub: "Account-linked service tickets", flush: true,
      body: '<div id="ticketTable"></div>' });

  UI.dataTable(root.querySelector("#ticketTable"), {
    rows: D.tickets,
    pageSize: 7,
    searchPlaceholder: "Search ticket, account, subject or owner",
    defaultSort: "priority", defaultDir: "asc",
    columns: [
      { field: "id", label: "Ticket", render: function (x) { return "<b>" + UI.esc(x.id) + "</b>"; } },
      { field: "account", label: "Account", wrap: true },
      { field: "subject", label: "Subject", wrap: true },
      { field: "priority", label: "Priority", render: function (x) { return UI.pill(x.priority, priorityTone(x.priority), "alert"); } },
      { field: "owner", label: "Owner", render: function (x) { return UI.person(x.owner, null, "sm"); } },
      { field: "sla", label: "SLA", render: function (x) { return UI.ltr(x.sla); } },
      { field: "state", label: "State", sortable: false, render: function (x) { return UI.statusPill(x.state); } },
      { field: "open", label: "", sortable: false, searchable: false,
        render: function () { return Icon("chevronRight", { size: 15, cls: "muted" }); } }
    ],
    onRow: function (x) {
      UI.openDrawer({
        eyebrow: x.id,
        title: x.subject,
        sub: x.account + " - opened " + x.opened,
        body:
          '<div class="grid grid--2">' +
            UI.card({ title: "Ticket", body:
              UI.field("Priority", x.priority) +
              UI.field("Owner", x.owner) +
              UI.field("SLA", x.sla) +
              UI.field("State", t("s." + x.state)) }) +
            UI.card({ title: "CRM impact", body:
              UI.field("Account", x.account) +
              UI.field("Linked deal", (D.deals.filter(function (d) { return d.account === x.account; })[0] || {}).id) +
              UI.field("Commercial risk", x.priority === "High" ? "High touch required" : "Monitor") }) +
          "</div>",
        foot:
          UI.btn({ label: "Reply", icon: "message", variant: "primary", demo: "reply" }) +
          UI.btn({ label: "Attach file", icon: "file", demo: "file" })
      });
    }
  });
};
