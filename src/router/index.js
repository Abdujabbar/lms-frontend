import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/homework/questions/:id",
    name: "Single question page",
    component: () => import(/* webpackChunkName: "questions" */ "@/views/Question.vue"),
  },
  {
    path: "/homework/answers/:id",
    name: "Single answer page",
    component: () => import(/* webpackChunkName: "answers" */ "@/views/Answer.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: {
      public: true,
    },
  },
  {
    path: "/mail-sent",
    name: "LoginPasswordlessSuccess",
    component: () => import(/* webpackChunkName: "loginPasswordlessSuccess" */ "@/views/LoginPasswordlessSuccess.vue"),
    meta: {
      public: true,
    },
  },
  {
    path: "/auth/passwordless/:token",
    name: "Passwordless Login second step",
    component: () => import(/* webpackChunkName: "login" */ "@/views/LoginSecondStep.vue"),
    meta: {
      public: true,
    },
  },
  {
    path: "/auth/as/:id",
    name: "LoginAs",
    component: () => import(/* webpackChunkName: "loginAs" */ "@/views/LoginAs.vue"),
  },
  {
    path: "/notion/:page",
    name: "notion",
    component: () => import(/* webpackChunkName: "loginAs" */ "@/views/Notion.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta?.public && !store.getters["auth/isAuthenticated"]) {
    return next({
      name: "Login",
      query: { next: to.fullPath },
    });
  }
  next();
});

export default router;
