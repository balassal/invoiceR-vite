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
    route: "/settings/company",
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
];

export function getMainMenu() {
  return mainMenu;
}

export function getSettingsMenu() {
  return settingsMenu;
}
