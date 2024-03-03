const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "todos", component: () => import("pages/TodoPage.vue") },
    ],
    meta: { auth: true },
  },
  { path: "/create", component: () => import("pages/Create.vue") },
  { path: "/edit/:id", component: () => import("pages/Edit.vue") },
  { path: "/:id", component: () => import("pages/Details.vue") },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
        name: "login",
      },
      {
        path: "register",
        component: () => import("pages/RegisterPage.vue"),
        name: "register",
      },
    ],
    meta: { auth: false },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
