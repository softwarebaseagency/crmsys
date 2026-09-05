(function (global) {
  "use strict";

  function addStatus(id, label, tone, icon) {
    UI.STATUS[id] = { key: "s." + id, tone: tone, icon: icon };
    I18n.DICT["s." + id] = label;
  }

  addStatus("qualified", "Qualified", "info", "checkCircle");
  addStatus("proposal", "Proposal", "warning", "file");
  addStatus("negotiation", "Negotiation", "serious", "message");
  addStatus("won", "Won", "good", "award");
  addStatus("lost", "Lost", "critical", "xCircle");
  addStatus("renewal", "Renewal", "info", "refresh");
  addStatus("escalated", "Escalated", "critical", "alert");

  function Deal(id, account, contact, stage, owner, amount, probability, closeDate, source, state, nextStep) {
    return { id: id, account: account, contact: contact, stage: stage, owner: owner,
      amount: amount, probability: probability, closeDate: closeDate, source: source,
      state: state, nextStep: nextStep };
  }

  function Account(id, name, sector, tier, city, owner, revenue, health, openDeals, contacts, lastTouch, state) {
    return { id: id, name: name, sector: sector, tier: tier, city: city, owner: owner,
      revenue: revenue, health: health, openDeals: openDeals, contacts: contacts,
      lastTouch: lastTouch, state: state };
  }

  function Contact(id, name, title, account, email, phone, owner, warmth, lastTouch, state) {
    return { id: id, name: name, title: title, account: account, email: email,
      phone: phone, owner: owner, warmth: warmth, lastTouch: lastTouch, state: state };
  }

  function Activity(id, when, type, owner, account, contact, note, outcome, next, state) {
    return { id: id, when: when, type: type, owner: owner, account: account,
      contact: contact, note: note, outcome: outcome, next: next, state: state };
  }

  function Ticket(id, account, subject, priority, owner, sla, opened, state) {
    return { id: id, account: account, subject: subject, priority: priority,
      owner: owner, sla: sla, opened: opened, state: state };
  }

  var STAGES = ["Lead", "Qualified", "Demo", "Proposal", "Negotiation"];

  var DEALS = [
    Deal("D-2401", "Rivan Foods", "Ari Omar", "Negotiation", "Lana Aziz", 148000000, 72, "18 Sep 2026", "Referral", "negotiation", "Send revised implementation calendar"),
    Deal("D-2402", "Korek Retail Group", "Sara Hama", "Proposal", "Hemin Barzan", 92000000, 58, "24 Sep 2026", "Website", "proposal", "Confirm legal review owner"),
    Deal("D-2403", "Nawroz Clinics", "Dr. Bayan Salih", "Demo", "Darin Qadir", 64000000, 44, "02 Oct 2026", "Outbound", "qualified", "Run billing workflow demo"),
    Deal("D-2404", "Ava Construction", "Karwan Nuri", "Qualified", "Lana Aziz", 51000000, 36, "29 Sep 2026", "LinkedIn", "qualified", "Map decision committee"),
    Deal("D-2405", "Zagros Logistics", "Mina Rasul", "Lead", "Shaho Karim", 38000000, 18, "14 Oct 2026", "Event", "pending", "Book discovery call"),
    Deal("D-2406", "Metro Pharmacy", "Jwan Sami", "Negotiation", "Darin Qadir", 116000000, 69, "20 Sep 2026", "Partner", "negotiation", "Approve security appendix"),
    Deal("D-2407", "City Learn Academy", "Hana Latif", "Proposal", "Shaho Karim", 72000000, 52, "28 Sep 2026", "Referral", "proposal", "Finalize training seats"),
    Deal("D-2408", "North Star Media", "Rebaz Hadi", "Demo", "Hemin Barzan", 45000000, 41, "06 Oct 2026", "Website", "qualified", "Show campaign reporting"),
    Deal("D-2409", "Helin Beauty", "Rojin Ahmed", "Qualified", "Lana Aziz", 26000000, 31, "10 Oct 2026", "Walk-in", "qualified", "Validate WhatsApp integration"),
    Deal("D-2410", "Dijla Insurance", "Tara Jalal", "Lead", "Darin Qadir", 84000000, 22, "21 Oct 2026", "Outbound", "pending", "Find operations sponsor"),
    Deal("D-2411", "Soran Hospitality", "Alan Fatah", "Won", "Hemin Barzan", 104000000, 100, "30 Aug 2026", "Referral", "won", "Handoff to onboarding"),
    Deal("D-2412", "Bayan Electronics", "Narin Yasin", "Lost", "Shaho Karim", 33000000, 0, "27 Aug 2026", "Website", "lost", "Revisit in Q1 budget cycle")
  ];

  var ACCOUNTS = [
    Account("A-1001", "Rivan Foods", "Food distribution", "Enterprise", "Erbil", "Lana Aziz", 312000000, 82, 2, 7, "04 Sep 2026", "active"),
    Account("A-1002", "Korek Retail Group", "Retail", "Enterprise", "Baghdad", "Hemin Barzan", 224000000, 76, 1, 9, "03 Sep 2026", "active"),
    Account("A-1003", "Nawroz Clinics", "Healthcare", "Growth", "Sulaymaniyah", "Darin Qadir", 128000000, 68, 2, 6, "02 Sep 2026", "active"),
    Account("A-1004", "Ava Construction", "Construction", "Growth", "Duhok", "Lana Aziz", 94000000, 55, 1, 4, "29 Aug 2026", "onHold"),
    Account("A-1005", "Zagros Logistics", "Logistics", "Mid-market", "Erbil", "Shaho Karim", 87000000, 49, 1, 5, "01 Sep 2026", "active"),
    Account("A-1006", "Metro Pharmacy", "Pharmacy", "Enterprise", "Baghdad", "Darin Qadir", 196000000, 73, 1, 8, "05 Sep 2026", "active"),
    Account("A-1007", "City Learn Academy", "Education", "Mid-market", "Erbil", "Shaho Karim", 72000000, 61, 1, 3, "31 Aug 2026", "active"),
    Account("A-1008", "North Star Media", "Media", "Growth", "Erbil", "Hemin Barzan", 64000000, 58, 1, 5, "30 Aug 2026", "active"),
    Account("A-1009", "Helin Beauty", "Beauty services", "SMB", "Baghdad", "Lana Aziz", 26000000, 43, 1, 2, "26 Aug 2026", "pending"),
    Account("A-1010", "Dijla Insurance", "Insurance", "Enterprise", "Baghdad", "Darin Qadir", 118000000, 37, 1, 4, "25 Aug 2026", "pending")
  ];

  var CONTACTS = [
    Contact("C-501", "Ari Omar", "Operations Director", "Rivan Foods", "ari.omar@example.com", "+964 750 110 4031", "Lana Aziz", "Hot", "04 Sep 2026", "active"),
    Contact("C-502", "Sara Hama", "CFO", "Korek Retail Group", "sara.hama@example.com", "+964 770 118 2044", "Hemin Barzan", "Warm", "03 Sep 2026", "scheduled"),
    Contact("C-503", "Dr. Bayan Salih", "Clinic Director", "Nawroz Clinics", "bayan.salih@example.com", "+964 771 334 8201", "Darin Qadir", "Hot", "02 Sep 2026", "active"),
    Contact("C-504", "Karwan Nuri", "Commercial Manager", "Ava Construction", "karwan.nuri@example.com", "+964 751 227 1190", "Lana Aziz", "Warm", "29 Aug 2026", "onHold"),
    Contact("C-505", "Mina Rasul", "Logistics Lead", "Zagros Logistics", "mina.rasul@example.com", "+964 750 772 4410", "Shaho Karim", "Cold", "01 Sep 2026", "pending"),
    Contact("C-506", "Jwan Sami", "Managing Partner", "Metro Pharmacy", "jwan.sami@example.com", "+964 780 221 5519", "Darin Qadir", "Hot", "05 Sep 2026", "active"),
    Contact("C-507", "Hana Latif", "Academy Manager", "City Learn Academy", "hana.latif@example.com", "+964 750 871 1299", "Shaho Karim", "Warm", "31 Aug 2026", "scheduled"),
    Contact("C-508", "Rebaz Hadi", "Founder", "North Star Media", "rebaz.hadi@example.com", "+964 751 600 3100", "Hemin Barzan", "Warm", "30 Aug 2026", "active"),
    Contact("C-509", "Rojin Ahmed", "Owner", "Helin Beauty", "rojin.ahmed@example.com", "+964 770 918 0442", "Lana Aziz", "Cold", "26 Aug 2026", "pending"),
    Contact("C-510", "Tara Jalal", "Transformation Lead", "Dijla Insurance", "tara.jalal@example.com", "+964 770 533 8004", "Darin Qadir", "Warm", "25 Aug 2026", "scheduled")
  ];

  var ACTIVITIES = [
    Activity("ACT-901", "05 Sep 2026 10:30", "Call", "Lana Aziz", "Rivan Foods", "Ari Omar", "Negotiated service-level terms and narrowed launch to two branches.", "Decision committee aligned", "Revised calendar due 06 Sep", "completed"),
    Activity("ACT-902", "05 Sep 2026 09:10", "Email", "Darin Qadir", "Metro Pharmacy", "Jwan Sami", "Sent security appendix and payment gateway checklist.", "Waiting on legal", "Follow up 08 Sep", "inProgress"),
    Activity("ACT-903", "04 Sep 2026 15:40", "Demo", "Hemin Barzan", "North Star Media", "Rebaz Hadi", "Walked through campaign ROI and approval flows.", "Strong fit", "Send proposal draft", "completed"),
    Activity("ACT-904", "04 Sep 2026 12:20", "Meeting", "Shaho Karim", "City Learn Academy", "Hana Latif", "Confirmed training seat range and data migration concerns.", "Budget owner missing", "Book finance review", "scheduled"),
    Activity("ACT-905", "03 Sep 2026 16:15", "Task", "Lana Aziz", "Ava Construction", "Karwan Nuri", "Requested updated branch list from operations.", "No response", "Escalate after 2 days", "onHold"),
    Activity("ACT-906", "03 Sep 2026 11:50", "Call", "Darin Qadir", "Nawroz Clinics", "Dr. Bayan Salih", "Qualified insurance claims workflow.", "Demo requested", "Prepare billing demo", "completed"),
    Activity("ACT-907", "02 Sep 2026 14:05", "Email", "Shaho Karim", "Zagros Logistics", "Mina Rasul", "Shared discovery summary and sample rollout plan.", "Discovery booked", "Call on 07 Sep", "scheduled")
  ];

  var TICKETS = [
    Ticket("T-3301", "Rivan Foods", "Need SSO mapping for branch managers", "High", "Nian Sabir", "6h left", "05 Sep 2026", "open"),
    Ticket("T-3302", "Metro Pharmacy", "Payment gateway field list requested", "Medium", "Darin Qadir", "1d left", "04 Sep 2026", "pending"),
    Ticket("T-3303", "Korek Retail Group", "Legal review blocked on DPA redline", "High", "Hemin Barzan", "Overdue", "02 Sep 2026", "escalated"),
    Ticket("T-3304", "Nawroz Clinics", "Demo user permissions reset", "Low", "Nian Sabir", "2d left", "03 Sep 2026", "completed"),
    Ticket("T-3305", "City Learn Academy", "Migration sample needs validation", "Medium", "Shaho Karim", "9h left", "05 Sep 2026", "open")
  ];

  var ALERTS = [
    { tone: "critical", icon: "alert", title: "Korek legal redline is overdue",
      meta: "Proposal value 92M IQD - owner Hemin Barzan" },
    { tone: "warning", icon: "clock", title: "Three late follow-ups need attention",
      meta: "Ava Construction, Helin Beauty and Dijla Insurance" },
    { tone: "info", icon: "calendar", title: "Four demos scheduled next week",
      meta: "Healthcare, retail, education and media segments" }
  ];

  var FORECAST = {
    categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    series: [
      { name: "Pipeline", label: "Pipeline", values: [248, 286, 328, 354, 392, 418] },
      { name: "Weighted", label: "Weighted", values: [112, 136, 164, 188, 201, 225] },
      { name: "Closed won", label: "Closed won", values: [76, 84, 104, 0, 0, 0] }
    ]
  };

  function openDeals() {
    return DEALS.filter(function (d) { return STAGES.indexOf(d.stage) >= 0; });
  }

  function totalDeals(rows) {
    return (rows || DEALS).reduce(function (s, d) { return s + d.amount; }, 0);
  }

  function weightedDeals(rows) {
    return (rows || openDeals()).reduce(function (s, d) {
      return s + Math.round(d.amount * d.probability / 100);
    }, 0);
  }

  function stageRows() {
    return STAGES.map(function (stage) {
      var rows = DEALS.filter(function (d) { return d.stage === stage; });
      return { name: stage, value: totalDeals(rows), count: rows.length };
    });
  }

  function ownerRows() {
    var map = {};
    openDeals().forEach(function (d) { map[d.owner] = (map[d.owner] || 0) + d.amount; });
    return Object.keys(map).map(function (name) { return { name: name, value: map[name] }; });
  }

  function sourceRows() {
    var map = {};
    DEALS.forEach(function (d) { map[d.source] = (map[d.source] || 0) + d.amount; });
    return Object.keys(map).map(function (name) { return { name: name, value: map[name] }; });
  }

  function activityRows() {
    var map = {};
    ACTIVITIES.forEach(function (a) { map[a.type] = (map[a.type] || 0) + 1; });
    return Object.keys(map).map(function (name) { return { name: name, value: map[name] }; });
  }

  global.DATA = {
    meta: {
      org: "Base CRM Demo",
      unit: "Client revenue desk",
      today: "Saturday 5 September 2026",
      updated: "05 Sep 2026 12:08",
      currency: "IQD",
      user: { name: "Lana Aziz", role: "Revenue operations lead", email: "lana.aziz@example.com" }
    },
    stages: STAGES,
    deals: DEALS,
    accounts: ACCOUNTS,
    contacts: CONTACTS,
    activities: ACTIVITIES,
    tickets: TICKETS,
    alerts: ALERTS,
    charts: {
      forecast: FORECAST,
      stages: stageRows(),
      owners: ownerRows(),
      sources: sourceRows(),
      activity: activityRows(),
      accountHealth: ACCOUNTS.map(function (a) { return { name: a.name, value: a.health }; })
    },
    sparks: {
      pipeline: [248, 286, 328, 354, 392, 418],
      weighted: [112, 136, 164, 188, 201, 225],
      winrate: [24, 27, 29, 26, 31, 34],
      support: [7, 6, 7, 5, 6, 4]
    },
    openDeals: openDeals,
    totalDeals: totalDeals,
    weightedDeals: weightedDeals,
    stageRows: stageRows,
    ownerRows: ownerRows,
    supportOpen: function () {
      return TICKETS.filter(function (t) { return t.state !== "completed"; }).length;
    },
    countDeals: function (stage) {
      return DEALS.filter(function (d) { return d.stage === stage; }).length;
    },
    accountByName: function (name) {
      return ACCOUNTS.filter(function (a) { return a.name === name; })[0];
    }
  };
})(window);
