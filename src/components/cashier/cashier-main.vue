<template>
  <cashierHeader />

  <div class="container-fluid">
    <div class="row mt-3">
      <div class="card text-center">
        <div class="card-header fw-bold">Account Information</div>
        <div class="card-body d-flex justify-content-center">
          <div class="card w-50">
            <div class="card-header">Enter Account Number</div>
            <div class="card-body">
              <input
                type="text"
                name="accountNo"
                id="account-number"
                class="form-control"
                placeholder="Account Number"
                v-model="state.accountNumber"
                :class="{ 'is-invalid': v$.accountNumber.$error }"
              />
              <div
                class="invalid-feedback text-start"
                :if="v$.accountNumber.$error"
              >
                {{ v$.accountNumber.$errors[0]?.$message }}
              </div>
              <button
                class="btn btn-info mt-3"
                @click="getAccountInfo"
                type="button"
              >
                Get Account Info
              </button>
            </div>
          </div>
        </div>
        <template v-if="userData">
          <div class="row mx-auto col-10">
            <table class="table table-borderless border table-striped-columns">
              <tbody>
                <tr>
                  <td class="fw-bold">Account No:</td>
                  <td>{{ userData.accountNo }}</td>
                  <td class="fw-bold">Holder Name:</td>
                  <td>{{ userData.name }}</td>
                  <td class="fw-bold">Holder Account Type:</td>
                  <td>{{ userData.accountType }}</td>
                  <td class="fw-bold">Bank Balance:</td>
                  <td>{{ userData.currentBalance }}</td>
                </tr>
              </tbody>
            </table>
            <table class="table table-boderless border mb-3">
              <tbody>
                <tr>
                  <td>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        class="btn-check"
                        name="btnradio"
                        id="btnradio1"
                        autocomplete="off"
                        @click="transaction = 'withdraw'"
                        checked
                      />
                      <label class="btn btn-outline-primary" for="btnradio1"
                        >Withdraw</label
                      >

                      <input
                        type="radio"
                        class="btn-check"
                        name="btnradio"
                        id="btnradio2"
                        autocomplete="off"
                        @click="transaction = 'deposit'"
                      />
                      <label class="btn btn-outline-primary" for="btnradio2"
                        >Deposit</label
                      >
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="accountNo"
                      id="account-number"
                      class="form-control"
                      :placeholder="
                        transaction === 'withdraw'
                          ? 'Write Amount for Withdraw'
                          : 'Write Amount for Deposit'
                      "
                      v-model="state.amount"
                      :class="{ 'is-invalid': a$.amount.$error }"
                    />
                    <div
                      class="invalid-feedback text-start"
                      :if="a$.amount.$error"
                    >
                      {{ a$.amount.$errors[0]?.$message }}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      @click="onTransaction"
                      class="btn btn-info text-capitalize"
                    >
                      {{ transaction }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <div class="card-footer text-muted">@Mirafra Bank</div>
      </div>
    </div>
  </div>
</template>

<script>
import cashierHeader from "./cashier-header.vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  numeric,
  minLength,
  maxLength,
  minValue,
} from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";
export default {
  name: "cashier-main",
  setup() {
    const state = reactive({
      accountNumber: "",
      amount: 0,
    });

    const rules = computed(() => {
      return {
        accountNumber: {
          required,
          numeric,
          min: minLength(10),
          max: maxLength(10),
        },
      };
    });

    const rules2 = computed(() => {
      return {
        amount: {
          required,
          numeric,
          min: minValue(1),
        },
      };
    });

    const a$ = useVuelidate(rules2, state);
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
      a$,
    };
  },
  data() {
    return {
      transaction: "withdraw",
      userData: null,
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  methods: {
    async getAccountInfo() {
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }
      try {
        const url = "api/getAccountDetails/" + this.state.accountNumber;
        const response = await axios.get(url, { headers: this.headers });
        if (response.data.status === 200) {
          this.userData = response.data.data;
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (error) {
        this.$toast.error("Something went wrong, unable to connect");
      }
    },
    async onTransaction() {
      this.a$.$validate();
      if (this.a$.$error) {
        return;
      }
      if (
        this.transaction === "withdraw" &&
        this.userData.currentBalance < this.state.amount
      ) {
        this.$toast.error(
          "Invalid amount, check once the current balance of account holder"
        );
        return;
      }
      const payload = { ...this.userData };
      payload.currentBalance =
        this.transaction === "withdraw"
          ? payload.currentBalance - this.state.amount
          : payload.currentBalance + this.state.amount;
      payload.transfer.push({
        fromAmount: this.userData.currentBalance,
        amount: this.state.amount,
        transactionType: this.transaction,
        from: "cashier",
        transactionBy: "cashier",
      });
      const url = "api/updateUser/" + this.userData._id;
      const response = await axios.put(url, payload, { headers: this.headers });
      if (response.data.status === 200) {
        this.reset();
        this.userData = null;
        this.$toast.success(`Amount ${this.transaction} successfully`);
      } else {
        console.log(response.data.message);
      }
    },
    reset() {
      this.v$.$reset();
      this.a$.$reset();
      this.state.amount = "";
      this.state.accountNumber = "";
      this.userData = null;
    },
  },
  components: {
    cashierHeader,
  },
};
</script>
