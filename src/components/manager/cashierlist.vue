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
          @click="openAddAccount"
        >
          Add New Staff
        </button>
      </div>

      <EasyDataTable show-index :headers="headers" :items="items">
        <template #loading>
          <img
            src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
            style="width: 100px; height: 80px"
          />
        </template>
        <template #item-action="item">
          <div>
            <a href="javascript:void(0)" class="me-2" @click="editItem(item)"
              >Edit</a
            >
            <a href="javascript:void(0)" @click="deleteItem(item)">Delete</a>
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
              New Cashier Account
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
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
              Save
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
      headers: [
        { text: "Email", value: "player" },
        { text: "Password", value: "position" },
        { text: "Account type", value: "indicator.height" },
        { text: "Action", value: "action" },
      ],
      items: [
        {
          player: "Stephen Curry",
          team: "GSW",
          number: 30,
          position: "G",
          indicator: { height: "6-2", weight: 185 },
          lastAttended: "Davidson",
          country: "USA",
        },
        {
          player: "Lebron James",
          team: "LAL",
          number: 6,
          position: "F",
          indicator: { height: "6-9", weight: 250 },
          lastAttended: "St. Vincent-St. Mary HS (OH)",
          country: "USA",
        },
        {
          player: "Kevin Durant",
          team: "BKN",
          number: 7,
          position: "F",
          indicator: { height: "6-10", weight: 240 },
          lastAttended: "Texas-Austin",
          country: "USA",
        },
        {
          player: "Giannis Antetokounmpo",
          team: "MIL",
          number: 34,
          position: "F",
          indicator: { height: "6-11", weight: 242 },
          lastAttended: "Filathlitikos",
          country: "Greece",
        },
      ],
    };
  },
  methods: {
    addAccount() {
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }
    },
    openAddAccount() {},
    closeCashierForm() {
      this.v$.$reset();
    },
  },
};
</script>

<style></style>
