import { createRouter, createWebHistory } from "vue-router";
import CalcWaterprice from "../views/calcWaterprice.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/calc-waterprice",
    },
    {
      path: "/calc-waterprice",
      name: "CalcWaterprice",
      component: CalcWaterprice,
    },
  ],
});

export default router;
