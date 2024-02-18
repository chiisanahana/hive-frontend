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
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
    },
    {
      path: "/cars",
      name: "view-cars",
      component: () => import("@/pages/ViewCarPage.vue"),
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
