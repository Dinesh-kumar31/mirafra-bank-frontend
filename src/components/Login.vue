<template>
  <div class="container-fluid">
    <div class="row mt-5">
      <h1 class="text-success text-center">Mirafra Bank</h1>
      <div class="d-flex justify-content-center align-center">
        <img src="../assets/bank-img.jpg" class="w-25" alt="image" />
        <div class="card text-center">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item" @click="selectTab('manager')">
                <a
                  class="nav-link"
                  aria-current="true"
                  :class="{ active: tabName === 'manager' }"
                  href="javascript:void(0)"
                  >Manager</a
                >
              </li>
              <li class="nav-item" @click="selectTab('cashier')">
                <a
                  class="nav-link"
                  :class="{ active: tabName === 'cashier' }"
                  href="javascript:void(0)"
                  >Cashier</a
                >
              </li>
              <li class="nav-item" @click="selectTab('user')">
                <a
                  class="nav-link"
                  :class="{ active: tabName === 'user' }"
                  href="javascript:void(0)"
                  >User</a
                >
              </li>
            </ul>
          </div>
          <div class="card-body">
            <form class="row needs-validation g-3" ref="loginForm" non-validate>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="Email address"
                  v-model="state.email"
                  :class="{ 'is-invalid': v$.email.$error }"
                />
                <label for="floatingInput">Email address</label>
                <div class="invalid-feedback text-start" :if="v$.email.$error">
                  {{ v$.email.$errors[0]?.$message }}
                </div>
              </div>
              <div class="form-floating">
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  v-model="state.password"
                  autocomplete="off"
                  :class="{ 'is-invalid': v$.password.$error }"
                />
                <label for="floatingPassword">Password</label>
                <div
                  class="invalid-feedback text-start"
                  :if="v$.password.$error"
                >
                  {{ v$.password.$errors[0]?.$message }}
                </div>
              </div>
              <div class="mt-3 text-start">
                <button
                  type="button"
                  @click="userLogin()"
                  class="btn btn-primary"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
const axios = require("axios");
export default {
  name: "app-login",
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });

    const rules = computed(() => {
      return {
        email: { required, email },
        password: { required, min: minLength(5) },
      };
    });

    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      tabName: "manager",
    };
  },
  methods: {
    selectTab(tab) {
      this.v$.$reset();
      this.tabName = tab;
    },
    async userLogin() {
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }
      const payload = {
        email: this.state.email,
        password: this.state.password,
        role: this.tabName,
      };
      try {
        var url = "api/login";
        const response = await axios.post(url, payload);
        console.log(response);
        if (response.data.status === 200) {
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.user._id);
          const type =
            this.tabName === "manager"
              ? "manager/userlist"
              : this.tabName === "cashier"
              ? "cashiermain"
              : "user/useraccount";
          this.$router.push({ path: "/" + type });
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeMount() {},
};
</script>
