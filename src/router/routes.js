const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/invoices",
        name: "invoices",
        component: () => import("src/pages/invoice/Invoices.vue"),
      },
      {
        path: "/invoice/new",
        name: "createInvoice",
        component: () => import("src/pages/invoice/Invoice.vue"),
      },
      {
        path: "/invoice/:id",
        name: "invoice",
        component: () => import("src/pages/invoice/Invoice.vue"),
      },
    ],
  },
  {
    path: "/settings",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/settings/company",
        name: "company",
        component: () => import("src/pages/settings/Company.vue"),
      },
      {
        path: "/settings/language",
        name: "language",
        component: () => import("src/pages/settings/Language.vue"),
      },
      {
        path: "/settings/currency",
        name: "currency",
        component: () => import("src/pages/settings/Currency.vue"),
      },
      {
        path: "/settings/uom",
        name: "uom",
        component: () => import("src/pages/settings/Uom.vue"),
      },
    ],
  },
  {
    path: "/products",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/products/list",
        name: "productList",
        component: () => import("src/pages/product/ProductList.vue"),
      },
      {
        path: "/products/new",
        name: "createProduct",
        component: () => import("src/pages/product/Product.vue"),
      },
      {
        path: "/products/:id",
        name: "product",
        component: () => import("src/pages/product/Product.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
