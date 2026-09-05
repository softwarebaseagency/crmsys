(function (global) {
  "use strict";

  var t = I18n.t;

  var NAV = [
    { group: "Operate", items: [
      { id: "dashboard",  no: "00", label: "Dashboard",  full: "Dashboard", icon: "chartBar" },
      { id: "pipeline",   no: "01", label: "Pipeline",   full: "Deal Pipeline", icon: "briefcase" },
      { id: "accounts",   no: "02", label: "Accounts",   full: "Accounts", icon: "building" },
      { id: "contacts",   no: "03", label: "Contacts",   full: "Contacts", icon: "users" }
    ]},
    { group: "Engage", items: [
      { id: "activities", no: "04", label: "Activities", full: "Activities", icon: "calendarCheck" },
      { id: "support",    no: "05", label: "Support",    full: "Support", icon: "message" }
    ]},
    { group: "Control", items: [
      { id: "reports",    no: "06", label: "Reports",    full: "Reports", icon: "trend" },
      { id: "admin",      no: "07", label: "Admin",      full: "Admin", icon: "settings" }
    ]}
  ];

  var MODULES = {};
  NAV.forEach(function (g) { g.items.forEach(function (i) { MODULES[i.id] = i; }); });

  var DEFAULT_ROUTE = "dashboard";
  var main = document.getElementById("main");
  var sidebar = document.getElementById("sidebar");

  function currentRoute() {
    var hash = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
    return MODULES[hash] ? hash : DEFAULT_ROUTE;
  }

  function go(route) {
    if (currentRoute() === route && location.hash) { render(); return; }
    location.hash = "#/" + route;
  }

  function paintNav() {
    document.getElementById("navScroll").innerHTML = NAV.map(function (g) {
      return '<div class="navgroup"><p class="navgroup__label">' + UI.esc(g.group) + "</p>" +
        g.items.map(function (i) {
          return '<button class="navitem" type="button" data-route="' + i.id + '">' +
            '<span class="navitem__num">' + i.no + "</span>" +
            Icon(i.icon, { size: 18, cls: "navitem__icon" }) +
            '<span class="navitem__label">' + UI.esc(i.label) + "</span>" +
            (i.id === "support" ? '<span class="navitem__badge">' + DATA.supportOpen() + "</span>" : "") +
          "</button>";
        }).join("") + "</div>";
    }).join("");
    markActive();
  }

  function markActive() {
    var route = currentRoute();
    document.querySelectorAll("[data-route]").forEach(function (b) {
      if (b.getAttribute("data-route") === route) { b.setAttribute("aria-current", "page"); }
      else { b.removeAttribute("aria-current"); }
    });
  }

  document.getElementById("navScroll").addEventListener("click", function (e) {
    var b = e.target.closest("[data-route]");
    if (!b) { return; }
    go(b.getAttribute("data-route"));
    if (window.matchMedia("(max-width: 1023px)").matches) { closeSidebar(); }
  });

  var scrim = null;
  function ensureScrim() {
    if (scrim) { return; }
    scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.addEventListener("click", closeSidebar);
    document.body.appendChild(scrim);
  }
  function openSidebar() {
    sidebar.setAttribute("data-open", "true");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "true");
    ensureScrim();
    scrim.setAttribute("data-open", "true");
  }
  function closeSidebar() {
    sidebar.removeAttribute("data-open");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
    if (scrim) { scrim.removeAttribute("data-open"); }
  }

  var wide = window.matchMedia("(min-width: 1024px)");
  (wide.addEventListener ? wide.addEventListener.bind(wide, "change") :
    wide.addListener.bind(wide))(function (e) { if (e.matches) { closeSidebar(); } });

  function render() {
    var route = currentRoute();
    var mod = MODULES[route];
    var view = global.Views && global.Views[route];

    document.title = mod.full + " - " + DATA.meta.org;
    markActive();

    var fresh = main.cloneNode(false);
    main.parentNode.replaceChild(fresh, main);
    main = fresh;
    main.className = "content view-enter";

    if (!view) {
      main.innerHTML = UI.empty({ title: "Module not available",
                                  text: "This route has no view registered." });
      return;
    }

    view(main, { module: mod });
    UI.wireDemoActions(main);
    I18n.apply(main);
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", function () { UI.closeDrawer(); render(); });

  var openMenu = null;
  function closeMenu() {
    if (!openMenu) { return; }
    openMenu.anchor.setAttribute("aria-expanded", "false");
    openMenu.node.remove();
    openMenu = null;
    document.removeEventListener("click", onDocClick, true);
  }
  function onDocClick(e) {
    if (openMenu && !openMenu.node.contains(e.target) &&
        !openMenu.anchor.contains(e.target)) { closeMenu(); }
  }
  function showMenu(anchor, html, onClick) {
    if (openMenu && openMenu.anchor === anchor) { closeMenu(); return; }
    closeMenu();
    var node = document.createElement("div");
    node.className = "menu";
    node.setAttribute("role", "menu");
    node.innerHTML = html;
    document.body.appendChild(node);

    var box = anchor.getBoundingClientRect();
    var left = I18n.dir() === "rtl" ? box.left : box.right - node.offsetWidth;
    node.style.left = Math.max(8, Math.min(window.innerWidth - node.offsetWidth - 8, left)) + "px";
    node.style.top = (box.bottom + window.scrollY + 6) + "px";

    anchor.setAttribute("aria-expanded", "true");
    openMenu = { anchor: anchor, node: node };
    if (onClick) { node.addEventListener("click", onClick); }
    var first = node.querySelector("button, a");
    if (first) { first.focus(); }
    setTimeout(function () { document.addEventListener("click", onDocClick, true); }, 0);
  }

  function paintTopbar() {
    document.getElementById("menuBtn").innerHTML = Icon("menu", { size: 17 });
    document.getElementById("menuBtn").setAttribute("aria-label", t("act.openMenu"));
    document.getElementById("searchIcon").innerHTML = Icon("search", { size: 15 });
    document.getElementById("quickDealIcon").innerHTML = Icon("plus", { size: 15 });

    var langBtn = document.getElementById("langBtn");
    langBtn.innerHTML = Icon("globe", { size: 17 });
    langBtn.setAttribute("aria-label", t("act.language") + " - " + I18n.meta().short);

    var bell = document.getElementById("bellBtn");
    bell.innerHTML = Icon("bell", { size: 17 }) + '<span class="dot">' + DATA.alerts.length + "</span>";
    bell.setAttribute("aria-label", t("act.notifications") + " (" + DATA.alerts.length + ")");

    var userBtn = document.getElementById("userBtn");
    userBtn.innerHTML = UI.avatar(DATA.meta.user.name, "sm") + Icon("chevronDown", { size: 13 });
    userBtn.setAttribute("aria-label", t("act.account"));

    var gs = document.getElementById("globalSearch");
    gs.placeholder = "Search accounts, contacts and deals";
    gs.setAttribute("aria-label", gs.placeholder);
  }

  function wireTopbar() {
    document.getElementById("menuBtn").addEventListener("click", function () {
      if (sidebar.getAttribute("data-open") === "true") { closeSidebar(); } else { openSidebar(); }
    });

    document.getElementById("quickDealBtn").addEventListener("click", function () {
      UI.toast(t("demo.entryDisabled"), "lock");
    });

    document.getElementById("globalSearch").addEventListener("change", function () {
      UI.toast("Global search is only simulated in this demo. Use each table search for live filtering.", "search");
      this.value = "";
    });

    document.getElementById("langBtn").addEventListener("click", function () {
      var html = '<div class="menu__label">' + UI.esc(t("act.language")) + "</div>" +
        I18n.all().map(function (l) {
          return '<button type="button" role="menuitemradio" data-lang="' + l.code +
            '" aria-checked="' + (l.code === I18n.get()) + '"><span style="min-width:0">' +
            UI.esc(l.meta.native) + '<span class="muted text-2xs" style="display:block">' +
            UI.esc(l.meta.name + " - " + l.meta.dir.toUpperCase()) +
            (l.implemented ? "" : " - not in this demo") + "</span></span></button>";
        }).join("");
      showMenu(this, html, function (e) {
        var b = e.target.closest("[data-lang]");
        if (!b) { return; }
        if (!I18n.set(b.getAttribute("data-lang"))) { UI.toast(t("demo.langOnly"), "globe"); }
        closeMenu();
      });
    });

    document.getElementById("bellBtn").addEventListener("click", function () {
      var html = '<div class="menu__label">' + UI.esc(t("act.notifications")) + "</div>" +
        '<ul class="list" style="min-width:300px;max-width:360px">' +
        DATA.alerts.map(function (a) {
          return '<li style="padding:10px 12px"><span class="' +
            UI.cls(["pill", "pill--icon", a.tone && "pill--" + a.tone]) +
            '" style="margin-top:2px">' + Icon(a.icon, { size: 12 }) + "</span>" +
            '<span class="list__body"><span class="list__title">' + UI.esc(a.title) + "</span>" +
            '<span class="list__meta">' + UI.esc(a.meta) + "</span></span></li>";
        }).join("") + "</ul>";
      showMenu(this, html);
    });

    document.getElementById("userBtn").addEventListener("click", function () {
      var u = DATA.meta.user;
      var html = '<div class="menu__label">' + UI.esc(u.name) + "</div>" +
        '<div style="padding:0 12px 8px;font-size:var(--text-xs);color:var(--ink-muted)">' +
        UI.esc(u.role) + " - " + UI.esc(u.email) + "</div><hr>" +
        '<button type="button" data-demo-action="settings">' +
        Icon("settings", { size: 15 }) + "Settings</button><hr>" +
        '<button type="button" data-signout>' + Icon("logout", { size: 15 }) +
        UI.esc(t("act.signOut")) + "</button>";
      showMenu(this, html, function (e) {
        if (e.target.closest("[data-signout]")) { UI.toast("Sign out is disabled in the showcase demo.", "lock"); return; }
        if (e.target.closest("[data-demo-action]")) {
          UI.toast(t("demo.entryDisabled"), "lock");
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === "Escape" && sidebar.getAttribute("data-open") === "true") {
        closeSidebar();
        document.getElementById("menuBtn").focus();
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        document.getElementById("globalSearch").focus();
      }
      if (e.key === "F2" && !typing) {
        e.preventDefault();
        go("pipeline");
      }
    });
  }

  I18n.restore();
  paintNav();
  paintTopbar();
  wireTopbar();
  I18n.apply();
  I18n.onChange(function () { paintNav(); paintTopbar(); render(); });

  if (!location.hash) { location.replace("#/" + DEFAULT_ROUTE); }
  render();

  global.App = { go: go, MODULES: MODULES, NAV: NAV };
})(window);
