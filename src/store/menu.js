const mainMenu = [
  {
    title: "Home",
    subtitle: "Home page",
    icon: "home",
    route: "/",
  },
  {
    title: "Invoices",
    subtitle: "List of invoices",
    icon: "receipt",
    route: "/invoices",
  },
  {
    title: "Partners",
    subtitle: "Partner Settings",
    icon: "groups",
    route: "/partners",
  },
  {
    title: "Products",
    subtitle: "Product Settings",
    icon: "inventory",
    route: "/products/list",
  },
  {
    title: "Settings",
    subtitle: "General Settings",
    icon: "settings",
    route: "/settings",
  },
];

const settingsMenu = [
  {
    title: "Home",
    subtitle: "Home page",
    icon: "home",
    route: "/",
  },
  {
    title: "Company",
    subtitle: "Company Settings",
    icon: "business",
    route: "/settings/company",
  },
  {
    title: "Language",
    subtitle: "Language Settings",
    icon: "language",
    route: "/settings/language",
  },
  {
    title: "Currencies",
    subtitle: "Currency Settings",
    icon: "attach_money",
    route: "/settings/currency",
  },
  {
    title: "Unit of Measure",
    subtitle: "Unit of Measure Settings",
    icon: "square_foot",
    route: "/settings/uom",
  },
];

export function getMainMenu() {
  return mainMenu;
}

export function getSettingsMenu() {
  return settingsMenu;
}
