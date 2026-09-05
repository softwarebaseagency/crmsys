const fs = require("fs");
const vm = require("vm");

const elementRegistry = {};

function makeElement(id) {
  const node = {
    id,
    innerHTML: "",
    className: "",
    attributes: {},
    style: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; },
    removeAttribute(key) { delete this.attributes[key]; },
    addEventListener() {},
    appendChild() {},
    remove() {},
    focus() {},
    cloneNode() { return makeElement(this.id); },
    querySelector(selector) {
      if (selector && selector.charAt(0) === "#") {
        const id = selector.slice(1);
        elementRegistry[id] = elementRegistry[id] || makeElement(id);
        return elementRegistry[id];
      }
      return null;
    },
    querySelectorAll() { return []; },
    parentNode: { replaceChild() {} }
  };
  elementRegistry[id] = node;
  return node;
}

const documentStub = {
  nodes: {
    main: makeElement("main"),
    sidebar: makeElement("sidebar"),
    navScroll: makeElement("navScroll"),
    menuBtn: makeElement("menuBtn"),
    searchIcon: makeElement("searchIcon"),
    quickDealIcon: makeElement("quickDealIcon"),
    langBtn: makeElement("langBtn"),
    bellBtn: makeElement("bellBtn"),
    userBtn: makeElement("userBtn"),
    globalSearch: makeElement("globalSearch")
  },
  documentElement: makeElement("html"),
  body: makeElement("body"),
  getElementById(id) {
    this.nodes[id] = this.nodes[id] || makeElement(id);
    return this.nodes[id];
  },
  querySelectorAll() { return []; },
  addEventListener() {},
  createElement() { return makeElement("created"); }
};

documentStub.nodes.main.parentNode = {
  replaceChild(next) { documentStub.nodes.main = next; }
};

const context = {
  window: {},
  document: documentStub,
  location: { hash: "#/dashboard", replace(value) { this.hash = value; } },
  localStorage: { getItem() { return null; }, setItem() {} },
  setTimeout() { return 0; },
  clearTimeout() {},
  ResizeObserver: function ResizeObserver() { this.observe = function observe() {}; },
  getComputedStyle() {
    return { getPropertyValue() { return "#2f5fbf"; } };
  },
  matchMedia() { return { matches: false, addEventListener() {}, addListener() {} }; },
  scrollTo() {},
  console
};
context.window = context;

vm.createContext(context);

[
  "static/js/icons.js",
  "static/js/i18n.js",
  "static/js/charts.js",
  "static/js/ui.js",
  "static/js/data.js",
  "static/js/views/dashboard.js",
  "static/js/views/pipeline.js",
  "static/js/views/accounts.js",
  "static/js/views/contacts.js",
  "static/js/views/activities.js",
  "static/js/views/support.js",
  "static/js/views/reports.js",
  "static/js/views/admin.js"
].forEach((file) => vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file }));

const checks = [
  ["dashboard", "Open pipeline"],
  ["pipeline", "Deal Pipeline"],
  ["accounts", "Account book"],
  ["contacts", "All contacts"],
  ["activities", "Activity log"],
  ["support", "Support queue"],
  ["reports", "Forecast by month"],
  ["admin", "Workflow preview"]
];

checks.forEach(([name, expected]) => {
  const root = makeElement("main");
  context.Views[name](root, { module: {} });
  if (!root.innerHTML.includes(expected)) {
    throw new Error(`${name} did not render expected content: ${expected}`);
  }
  console.log(`${name}: ${root.innerHTML.length} chars`);
});
