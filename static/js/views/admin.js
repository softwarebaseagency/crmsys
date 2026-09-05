window.Views = window.Views || {};

window.Views.admin = function (root) {
  "use strict";
  var t = I18n.t;

  root.innerHTML =
    UI.pageHead({
      moduleNo: "07",
      title: "Admin",
      lede: "Roles, workflow settings, import rules and integration controls shown as a guarded demo surface.",
      actions:
        UI.btn({ label: "Save settings", icon: "check", variant: "primary", demo: "save" })
    }) +
    UI.notice({ tone: "brand", icon: "lock", title: t("demo.readOnly"),
      text: "Settings are intentionally read-only. Any action that would change security, integrations or data rules shows a demo prompt." }) +
    '<div class="grid grid--2">' +
      UI.card({ title: "Security roles", sub: "Example role matrix",
        body: '<div class="metric-list">' +
          '<div class="metric-list__row"><span class="metric-list__label">Admin</span><span class="metric-list__value">Full access</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Sales manager</span><span class="metric-list__value">Team pipeline</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Account owner</span><span class="metric-list__value">Owned records</span></div>' +
          '<div class="metric-list__row"><span class="metric-list__label">Support agent</span><span class="metric-list__value">Tickets only</span></div>' +
        "</div>",
        foot: UI.btn({ label: "Edit roles", icon: "settings", size: "sm", demo: "roles" }) }) +
      UI.card({ title: "Integrations", sub: "Connected systems in a production CRM",
        body: '<div class="metric-list">' +
          '<div class="metric-list__row"><span class="metric-list__label">Email sync</span><span class="metric-list__value">' + UI.statusPill("locked") + "</span></div>" +
          '<div class="metric-list__row"><span class="metric-list__label">Calendar sync</span><span class="metric-list__value">' + UI.statusPill("locked") + "</span></div>" +
          '<div class="metric-list__row"><span class="metric-list__label">Accounting export</span><span class="metric-list__value">' + UI.statusPill("locked") + "</span></div>" +
        "</div>",
        foot: UI.btn({ label: "Connect app", icon: "external", size: "sm", demo: "connect" }) }) +
    "</div>" +
    UI.card({ title: "Workflow preview", sub: "Disabled fields demonstrate the intended production setup",
      body: '<form class="form-preview">' +
        '<div class="form-preview__grid">' +
          '<label>Default owner<input value="Round-robin by territory" readonly></label>' +
          '<label>Lead SLA<select readonly><option>First response within 4 hours</option></select></label>' +
          '<label>Currency<input value="IQD" readonly></label>' +
          '<label>Fiscal period<select readonly><option>Calendar quarter</option></select></label>' +
        "</div>" +
        '<label>Demo action message<textarea readonly>This is only a demo. Production data entry, imports, outbound email, integrations and settings changes are disabled.</textarea></label>' +
      "</form>",
      foot:
        UI.btn({ label: "Test workflow", icon: "play", size: "sm", demo: "workflow" }) +
        UI.btn({ label: "Reset demo data", icon: "undo", size: "sm", demo: "reset" }) }) +
    UI.card({ title: "System coverage", sub: "Core CRM components included in this showcase",
      body: '<div class="row-tight">' +
        UI.pill("Dashboard", "good", "chartBar") +
        UI.pill("Pipeline", "good", "briefcase") +
        UI.pill("Accounts", "good", "building") +
        UI.pill("Contacts", "good", "users") +
        UI.pill("Activities", "good", "calendarCheck") +
        UI.pill("Support", "good", "message") +
        UI.pill("Reports", "good", "trend") +
        UI.pill("Admin", "good", "settings") +
      "</div>" });
};
