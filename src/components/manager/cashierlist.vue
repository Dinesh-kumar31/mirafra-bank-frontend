<template>
  <div class="container-fluid">
    <div class="row mt-3">
      <div class="mb-3 d-md-flex justify-content-md-between">
        <h5 class="fw-bold">All Staff Accounts</h5>
        <button
          class="btn btn-sm btn-success"
          aria-controls="modal"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          @click="openCashierForm(null, false)"
        >
          Add New Staff
        </button>
      </div>

      <EasyDataTable
        show-index
        :headers="header"
        :loading="loading"
        :items="cashierList"
      >
        <template #loading>
          <img
            src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
            style="width: 100px; height: 80px"
          />
        </template>
        <template #item-action="item">
          <div>
            <a
              href="javascript:void(0)"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              class="me-2"
              @click="openCashierForm(item, true)"
              >Edit</a
            >
            <a href="javascript:void(0)" @click="deleteCashier(item)">Delete</a>
          </div>
        </template>
      </EasyDataTable>
    </div>
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">
              {{ isEdit ? "Update Cashier Account" : "New Cashier Account" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-model"
              @click="closeCashierForm()"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <form class="needs-validation g-3" non-validate>
                <div class="col">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input
                      type="email"
                      id="email"
                      class="form-control"
                      placeholder="Email"
                      v-model="state.email"
                      :class="{ 'is-invalid': v$.email.$error }"
                    />

                    <div
                      class="invalid-feedback text-start"
                      :if="v$.email.$error"
                    >
                      {{ v$.email.$errors[0]?.$message }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="password">Password:</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Password"
                      v-model="state.password"
                      autocomplete="off"
                      :class="{ 'is-invalid': v$.password.$error }"
                    />

                    <div
                      class="invalid-feedback text-start"
                      :if="v$.password.$error"
                    >
                      {{ v$.password.$errors[0]?.$message }}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="addAccount()" class="btn btn-primary">
              {{ isEdit ? "Update" : "Save" }}
            </button>
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
import axios from "axios";

export default {
  name: "cashier-list",
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
      header: [
        { text: "Email", value: "email" },
        { text: "Password", value: "password" },
        { text: "Account type", value: "accountType" },
        { text: "Action", value: "action" },
      ],
      cashierList: [],
      isEdit: false,
      loading: false,
      selectedData: null,
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  methods: {
    async getAllCashier() {
      try {
        this.loading = true;
        var url = "api/getCashiers";
        const response = await axios.get(url, { headers: this.headers });
        if (response.data.status === 200) {
          this.cashierList = response.data.data;
        } else {
          this.$toast.error(response.data.message);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$toast.error("Something went wrong, unable to connect");
      }
    },
    async addAccount() {
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }
      const payload = {
        password: this.state.password,
        email: this.state.email,
        accountType: "Cashier",
        role: "cashier",
      };
      if (!this.isEdit) {
        const url = "api/createCashier";
        const response = await axios.post(url, payload, {
          headers: this.headers,
        });
        if (response.data.status === 200) {
          document.getElementById("close-model").click();
          this.closeCashierForm();
          this.getAllCashier();
          this.$toast.success("Cashier account created successfully");
        } else {
          this.$toast.error("Cashier account not created successfully");
        }
      } else {
        const url = "api/updateCashier/" + this.selectedData._id;
        const response = await axios.put(url, payload, {
          headers: this.headers,
        });
        if (response.data.status === 200) {
          document.getElementById("close-model").click();
          this.closeCashierForm();
          this.getAllCashier();
          this.$toast.success("Cashier account updated successfully");
        } else {
          this.$toast.error("Cashier account not updated successfully");
        }
      }
    },
    openCashierForm(data, type) {
      this.isEdit = type;
      this.selectedData = data;
      if (type) {
        this.state.email = data.email;
        this.state.password = data.password;
      }
    },
    async deleteCashier(data) {
      try {
        console.log(data);
        const url = "api/deleteCashier/" + data?._id;
        const response = await axios.delete(url, { headers: this.headers });
        if (response.data.status === 200) {
          this.getAllCashier();
          this.$toast.success("Cashier account deleted successfully");
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (error) {
        this.$toast.error("Something went wrong, unable to connect");
      }
    },
    closeCashierForm() {
      this.v$.$reset();
      this.state.email = "";
      this.state.password = "";
    },
  },
  beforeMount() {
    this.getAllCashier();
  },
};
</script>

<style></style>
