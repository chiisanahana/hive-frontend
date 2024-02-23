import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
    },
    {
      path: "/cars",
      name: "cars",
      component: () => import("@/pages/customer/ViewCarPage.vue"),
    },
    {
      path: "/cars/details",
      name: "car-details",
      component: () => import("@/pages/customer/CarDetails.vue"),
    },
    {
      path: "/manage-cars",
      name: "view-cars",
      component: () => import("@/pages/provider/ViewCarPage.vue"),
    },
    {
      path: "/manage-cars/add",
      name: "add-car",
      component: () => import("@/pages/provider/AddCarPage.vue"),
    },
    {
      path: "/manage-cars/edit",
      name: "edit-car",
      component: () => import("@/pages/provider/EditCarPage.vue"),
      props: true,
    },
  ],
});

export default router;
