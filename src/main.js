import { createApp } from "vue";
import VueSelect from "vue-select";
import Home from "./pages/Home.vue";
import Friends from "./pages/Friends.vue";
import "./index.css";
import App from "./App.vue";
import VueClipboard from "vue3-clipboard";
import { createRouter, createWebHistory } from "vue-router";
import VueGtag from "vue-gtag";
import store from "./store/index.js";
import Memories from "./pages/Memories.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/search", component: Friends },
  { path: "/memories", component: Memories },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(
  VueGtag,
  {
    config: { id: "G-ZJ1LQLNXRG" },
  },
  router
);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});
app.component("v-select", VueSelect);
app.mount("#app");
