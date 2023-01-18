<template>
  <div class="container-fluid">
    <div class="row mt-3 col-8 mx-auto">
      <div class="card text-center">
        <div class="card-header fw-bold">Fund Transfer</div>
        <div class="card-body">
          <h5>Your Account(₹): {{ ownData?.currentBalance }}</h5>
          <div class="row mt-2 col-6 mx-auto">
            <div class="card">
              <div class="card-header">New Transfer</div>
              <div class="card-body">
                <input
                  type="text"
                  name="accountNo"
                  id="account-number"
                  class="form-control"
                  placeholder="Enter Account Number"
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
                <hr />
                <template v-if="userData">
                  <div class="text-start mt-3">
                    <form action="">
                      <div class="mb-3">
                        <label for="account-no" class="form-label"
                          >Account No:
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="account-no"
                          disabled
                          v-model="userData.accountNo"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="holder-name" class="form-label"
                          >Account Holder Name:
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holder-name"
                          v-model="userData.name"
                          disabled
                        />
                      </div>
                      <div class="mb-3">
                        <label for="account-type" class="form-label"
                          >Account Type:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="account-type"
                          v-model="userData.accountType"
                          disabled
                        />
                      </div>
                      <div class="mb-3">
                        <label for="amount" class="form-label"
                          >Enter Amount for Transfer:</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          id="amount"
                          placeholder="Enter Amount"
                          v-model="state.amount"
                          :class="{ 'is-invalid': a$.amount.$error }"
                        />
                        <div
                          class="invalid-feedback text-start"
                          :if="a$.amount.$error"
                        >
                          {{ a$.amount.$errors[0]?.$message }}
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          @click="transferAmount"
                          class="btn btn-small btn-info"
                        >
                          Transfer
                        </button>
                      </div>
                    </form>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-start mb-3">
          <div class="card-header">Transfer History</div>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="item in transactionData"
              v-bind:key="item._id"
            >
              <span v-if="item.transactionType === 'selfwithdraw'">
                You a transfer a amount of {{ item.amount }} to
                <span class="text-capitalize"> {{ item.to }}</span> at
                {{ dateFormat(item.transactionData) }}
              </span>
              <span v-if="item.transactionType === 'selfdeposit'"
                ><span class="text-capitalize">{{ item.from }}</span> deposit a
                amount of {{ item.amount }} to you at
                {{ dateFormat(item.transactionData) }}</span
              >
            </li>
          </ul>
        </div>
        <div class="card-footer text-muted">@Mirafra Bank</div>
      </div>
    </div>
  </div>
</template>

<script>
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
import moment from "moment";
export default {
  name: "fund-transfer",
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
      userData: null,
      ownData: null,
      transactionData: [],
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  methods: {
    async getOwnData() {
      const url = "api/getUser/" + localStorage.getItem("userId");
      const response = await axios.get(url, { headers: this.headers });
      if (response.data.status === 422) {
        this.logout();
      } else if (response.data.status === 400) {
        console.log(response.data.message);
      } else {
        this.ownData = response.data.data;
        this.transactionData = response.data.data.transfer
          .reverse()
          .filter(
            (e) =>
              e.transactionType === "selfwithdraw" ||
              e.transactionType === "selfdeposit"
          );
      }
    },
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
          console.log(this.userData);
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (error) {
        this.$toast.error("Something went wrong, unable to connect");
      }
    },
    reset() {
      this.v$.$reset();
      this.a$.$reset();
      this.state.accountNumber = "";
      this.state.amount = "";
      this.userData = null;
    },
    dateFormat(value) {
      return moment(value).format("DD-MM-YYYY");
    },
    async transferAmount() {
      this.a$.$validate();
      if (this.a$.$error) {
        return;
      }

      if (this.ownData.currentBalance < this.state.amount) {
        this.$toast.error("Invalid amount, Check once your current balance");
        return;
      }
      if (this.userData._id === localStorage.getItem("userId")) {
        this.$toast.error("Invalid User, Give a proper account holder");
        return;
      }

      const topayload = { ...this.userData };
      topayload.currentBalance += this.state.amount;
      topayload.transfer.push({
        fromAmount: this.userData.currentBalance,
        amount: this.state.amount,
        transactionType: "selfdeposit",
        from: this.ownData.name,
        transactionBy: this.userData.name,
      });

      const frompayload = { ...this.ownData };
      frompayload.currentBalance -= this.state.amount;
      frompayload.transfer.push({
        fromAmount: this.ownData.currentBalance,
        amount: this.state.amount,
        transactionType: "selfwithdraw",
        from: this.ownData.name,
        to: this.userData.name,
        transactionBy: this.ownData.name,
      });
      const url = "api/fundTransfer";
      const response = await axios.put(url, [topayload, frompayload], {
        headers: this.headers,
      });
      if (response.data.status === 200) {
        this.reset();
        this.userData = null;
        this.getOwnData();
        this.$toast.success("Amount Transfered successfully");
      } else {
        this.$toast.error(response.data.message);
      }
    },
  },
  beforeMount() {
    this.getOwnData();
  },
};
</script>
