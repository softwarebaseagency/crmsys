window.Views = window.Views || {};

window.Views.activities = function (root) {
  "use strict";
  var t = I18n.t, D = DATA, F = Fmt;

  var timeline = '<div style="padding:20px 20px 4px"><ul class="timeline">' +
    D.activities.map(function (a) {
      return '<li data-tone="' + (a.state === "completed" ? "good" : a.state === "onHold" ? "critical" : "info") + '">' +
        '<div class="list__title">' + UI.esc(a.type) + " - " + UI.esc(a.account) + "</div>" +
        '<div class="list__meta">' + UI.esc(a.owner) + " - " + UI.esc(a.note) + "</div>" +
        '<div class="list__meta">' + UI.ltr(a.when) + "</div></li>";
    }).join("") + "</ul></div>";

  root.innerHTML =
    UI.pageHead({
      moduleNo: "04",
      title: "Activities",
      lede: "Calls, demos, meetings, emails and tasks that move relationships forward.",
      actions:
        UI.select({ label: "Type", options: ["All types", "Call", "Email", "Demo", "Meeting", "Task"] }) +
        UI.btn({ label: "Log activity", icon: "plus", variant: "primary", demo: "activity" })
    }) +
    UI.notice({ tone: "brand", icon: "info", title: t("demo.readOnly"),
      text: "The table, timeline and charts are live. Creating reminders, sending messages and syncing calendars are disabled in this demo." }) +
    '<div class="grid grid--wide">' +
      UI.card({ title: "Recent timeline", sub: "Latest sales touches", flush: true, body: timeline }) +
      UI.chartCard({ id: "activityMix", title: "Activity mix", sub: "Count by type" }) +
    "</div>" +
    UI.card({ title: "Activity log", sub: D.activities.length + " sample interactions", flush: true,
      body: '<div id="activityTable"></div>' });

  UI.dataTable(root.querySelector("#activityTable"), {
    rows: D.activities,
    pageSize: 7,
    searchPlaceholder: "Search activity, account, contact or owner",
    defaultSort: "when", defaultDir: "desc",
    columns: [
      { field: "id", label: "ID", render: function (a) { return "<b>" + UI.esc(a.id) + "</b>"; } },
      { field: "when", label: "When", render: function (a) { return UI.ltr(a.when); } },
      { field: "type", label: "Type", render: function (a) { return UI.pill(a.type, "", a.type === "Email" ? "mail" : a.type === "Call" ? "phone" : "calendar"); } },
      { field: "account", label: "Account", wrap: true },
      { field: "contact", label: "Contact" },
      { field: "owner", label: "Owner", render: function (a) { return UI.person(a.owner, null, "sm"); } },
      { field: "state", label: "State", sortable: false, render: function (a) { return UI.statusPill(a.state); } },
      { field: "open", label: "", sortable: false, searchable: false,
        render: function () { return Icon("chevronRight", { size: 15, cls: "muted" }); } }
    ],
    onRow: function (a) {
      UI.openDrawer({
        eyebrow: a.id,
        title: a.type + " with " + a.contact,
        sub: a.account + " - " + UI.ltr(a.when).replace(/<[^>]+>/g, ""),
        body:
          '<div class="grid grid--2">' +
            UI.card({ title: "Summary", body:
              UI.field("Owner", a.owner) +
              UI.field("Outcome", a.outcome) +
              UI.field("Next step", a.next) +
              UI.field("Status", t("s." + a.state)) }) +
            UI.card({ title: "Notes", body:
              '<p class="text-sm secondary">' + UI.esc(a.note) + "</p>" }) +
          "</div>",
        foot:
          UI.btn({ label: "Create task", icon: "plus", variant: "primary", demo: "task" }) +
          UI.btn({ label: "Sync calendar", icon: "calendar", demo: "calendar" })
      });
    }
  });

  UI.mountCharts(root, {
    activityMix: {
      type: "donut",
      title: "Activity mix",
      rows: D.charts.activity,
      categoryLabel: "Type",
      valueLabel: "Count",
      centerValue: F.int(D.activities.length),
      centerLabel: "touches",
      label: F.int
    }
  });
};
