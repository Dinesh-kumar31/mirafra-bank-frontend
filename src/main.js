import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "vue3-easy-data-table/dist/style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Vue3EasyDataTable from "vue3-easy-data-table";
import login from "../src/components/Login.vue";
import Manager from "../src/components/manager/manager-main.vue";
import UserList from "../src/components/manager/userlist.vue";
import CashierList from "../src/components/manager/cashierlist.vue";
import CashierMain from "../src/components/cashier/cashier-main.vue";
import UserMain from "../src/components/users/user-main.vue";
import UserAccount from "../src/components/users/user-account.vue";
import AccountStatement from "../src/components/users/account-statement.vue";
import FundTransfer from "../src/components/users/fund-transfer.vue";
import Toaster from "@meforma/vue-toaster";

const routes = [
  {
    path: "/",
    component: login,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token") && !localStorage.getItem("role")) {
        next();
      } else {
        next(from.path);
      }
    },
  },
  {
    path: "/manager",
    name: "Manager",
    component: Manager,
    redirect: { path: "/manager/userlist" },
    children: [
      {
        name: "UserList",
        path: "userlist",
        component: UserList,
        props: true,
        beforeEnter: (to, from, next) => {
          if (authenticate("manager")) {
            next();
          } else {
            next(from.path);
          }
        },
      },
      {
        name: "CashierList",
        path: "cashierlist",
        component: CashierList,
        props: true,
        beforeEnter: (to, from, next) => {
          if (authenticate("manager")) {
            next();
          } else {
            next(from.path);
          }
        },
      },
    ],
  },
  {
    path: "/cashiermain",
    name: "Cashier",
    component: CashierMain,
    beforeEnter: (to, from, next) => {
      if (authenticate("cashier")) {
        next();
      } else {
        next(from.path);
      }
    },
  },
  {
    path: "/user",
    name: "User",
    component: UserMain,
    redirect: { path: "/user/useraccount" },
    children: [
      {
        name: "UserAccount",
        path: "useraccount",
        component: UserAccount,
        beforeEnter: (to, from, next) => {
          if (authenticate("user")) {
            next();
          } else {
            next(from.path);
          }
        },
      },
      {
        name: "AccountStatement",
        path: "accountstatement",
        component: AccountStatement,
        beforeEnter: (to, from, next) => {
          if (authenticate("user")) {
            next();
          } else {
            next(from.path);
          }
        },
      },
      {
        name: "FundTransfer",
        path: "fundtransfer",
        component: FundTransfer,
        beforeEnter: (to, from, next) => {
          if (authenticate("user")) {
            next();
          } else {
            next(from.path);
          }
        },
      },
    ],
  },
];

function authenticate(from) {
  const role = localStorage.getItem("role");
  return role === from && !!localStorage.getItem("token");
}

const route = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

createApp(App)
  .use(route)
  .use(Toaster, {
    position: "bottom-right",
    queue: true,
    duration: 2500,
  })
  .component("EasyDataTable", Vue3EasyDataTable)
  .mount("#app");
