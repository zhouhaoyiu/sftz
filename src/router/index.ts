import { createRouter, createWebHistory } from "vue-router";
import CalcWaterprice from "../views/calcWaterprice.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: () => import("../views/Login.vue") },
    {
      path: "/",
      redirect: "/calc-waterprice",
    },
    {
      path: "/calc-waterprice",
      name: "CalcWaterprice",
      component: CalcWaterprice,
    },
    {
      path: "/print-page",
      name: "print-page",
      component: () => import("../views/printPage.vue"),
    },
    {
      path: "/excel-input",
      name: "excel-input",
      component: () => import("../views/excelInput.vue"),
    },
    {
      path: "/manage-info",
      name: "manage-info",
      component: () => import("../views/manageInfo.vue"),
    },
  ],
});

router.beforeEach(to => {
  if (to.path !== "/login" && !sessionStorage.getItem("waterSession")) return "/login";
  if (["/manage-info", "/excel-input"].includes(to.path) && sessionStorage.getItem("waterRole") !== "admin") return "/calc-waterprice";
});

export default router;
