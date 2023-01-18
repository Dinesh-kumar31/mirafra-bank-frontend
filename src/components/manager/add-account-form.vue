<template>
  <div class="container-fluid">
    <div class="row">
      <form class="row needs-validation g-3" ref="form" non-validate>
        <div class="col-md-4">
          <!-- <div class="col-md-8"> -->
          <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Name"
              v-model="state.name"
              :class="{ 'is-invalid': v$.name.$error }"
            />

            <div class="invalid-feedback text-start" :if="v$.name.$error">
              {{ v$.name.$errors[0]?.$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="account-number">Account Number:</label>
            <input
              type="text"
              class="form-control"
              id="account-number"
              placeholder="Account Number"
              v-model="state.accountNumber"
              :disabled="!isEdit"
              :class="{ 'is-invalid': v$.accountNumber.$error }"
            />

            <div
              class="invalid-feedback text-start"
              :if="v$.accountNumber.$error"
            >
              {{ v$.accountNumber.$errors[0]?.$message }}
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div class="col-md-4">
          <!-- <div class="col-md-8"> -->
          <div class="mb-3">
            <label for="cnic" class="form-label">CNIC:</label>
            <input
              type="text"
              class="form-control"
              id="cnic"
              placeholder="CNIC"
              v-model="state.cnic"
              :class="{ 'is-invalid': v$.cnic.$error }"
            />

            <div class="invalid-feedback text-start" :if="v$.cnic.$error">
              {{ v$.cnic.$errors[0]?.$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="account-type">Account Type:</label>
            <select
              class="form-select"
              v-model="state.accountType"
              :class="{ 'is-invalid': v$.accountType.$error }"
              aria-label="Default select example"
            >
              <option value="" disabled>Select</option>
              <option value="Current">Current</option>
              <option value="Savings">Savings</option>
            </select>

            <div
              class="invalid-feedback text-start"
              :if="v$.accountType.$error"
            >
              {{ v$.accountType.$errors[0]?.$message }}
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div class="col-md-4">
          <!-- <div class="col-md-8"> -->
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              v-model="state.email"
              :class="{ 'is-invalid': v$.email.$error }"
            />

            <div class="invalid-feedback text-start" :if="v$.email.$error">
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

            <div class="invalid-feedback text-start" :if="v$.password.$error">
              {{ v$.password.$errors[0]?.$message }}
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div class="col-md-4">
          <div class="mb-3">
            <label for="deposit" class="form-label">{{
              isEdit ? "Current Balance" : "Deposit:"
            }}</label>
            <input
              type="number"
              class="form-control"
              id="deposit"
              :placeholder="isEdit ? 'Current Balance' : 'Deposit'"
              :disabled="isEdit"
              v-model="state.deposit"
              :class="{ 'is-invalid': v$.deposit.$error }"
            />

            <div class="invalid-feedback text-start" :if="v$.deposit.$error">
              {{ v$.deposit.$errors[0]?.$message }}
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="mb-3">
            <label for="contact-number" class="form-label"
              >Contact Number:</label
            >
            <input
              type="text"
              class="form-control"
              id="contact-number"
              placeholder="Contact Number"
              v-model="state.contactNumber"
              :class="{ 'is-invalid': v$.contactNumber.$error }"
            />

            <div
              class="invalid-feedback text-start"
              :if="v$.contactNumber.$error"
            >
              {{ v$.contactNumber.$errors[0]?.$message }}
            </div>
          </div>
        </div>
        <div class="mt-3 text-start">
          <button type="button" @click="addAccount()" class="btn btn-primary">
            {{ isEdit ? "Update Account" : "Add Account" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  numeric,
  email,
  alpha,
  alphaNum,
  maxLength,
} from "@vuelidate/validators";

import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "add-account",
  props: {
    selectedUser: {},
    isEdit: Boolean,
  },
  data() {
    return {
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  setup() {
    const state = reactive({
      name: "",
      accountNumber: "",
      cnic: "",
      accountType: "",
      email: "",
      password: "",
      deposit: "",
      contactNumber: "",
    });
    const rules = computed(() => {
      return {
        name: { required, alpha },
        accountNumber: {
          required,
          numeric,
          min: minLength(10),
          max: maxLength(10),
        },
        cnic: { required, alphaNum },
        accountType: { required },
        email: { required, email },
        password: { required, min: minLength(5) },
        deposit: { required, numeric },
        contactNumber: { required, numeric },
      };
    });

    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  methods: {
    async addAccount() {
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }
      try {
        const payload = {
          name: this.state.name,
          cnic: this.state.cnic,
          email: this.state.email,
          accountNo: this.state.accountNumber,
          accountType: this.state.accountType,
          password: this.state.password,
          contactNo: this.state.contactNumber,
          currentBalance: this.state.deposit,
        };
        if (!this.isEdit) {
          payload.transfer = [
            {
              amount: this.state.deposit,
              transactionType: "deposit",
              from: "manager",
              transactionBy: "manager",
            },
          ];
        }
        if (!this.isEdit) {
          const url = "api/createUser";
          const response = await axios.post(url, payload, {
            headers: this.headers,
          });
          if (response.data.status === 200) {
            this.v$.$reset();
            this.$emit("userAdded");
            this.$toast.success(`User account added successfully`);
          } else {
            this.$toast.error(response.data.message);
          }
        } else {
          const url = "api/updateUser/" + this.selectedUser._id;
          const response = await axios.put(url, payload, {
            headers: this.headers,
          });
          if (response.data.status === 200) {
            this.v$.$reset();
            this.$emit("userAdded");
            this.$toast.success(`User account updated successfully`);
          } else {
            this.$toast.error(response.data.message);
          }
        }
      } catch (error) {
        this.$toast.error("Something went wrong, unable to connect");
      }
    },
    recurse() {
      let n = Math.floor(Math.random() * 10000000000);
      if (n.toString().length !== 10) {
        this.recurse();
      } else {
        this.state.accountNumber = Math.floor(Math.random() * 10000000000);
      }
    },
  },
  beforeMount() {
    if (this.isEdit) {
      this.state.name = this.selectedUser.name;
      this.state.accountNumber = this.selectedUser.accountNo;
      this.state.cnic = this.selectedUser.cnic;
      this.state.accountType = this.selectedUser.accountType;
      this.state.email = this.selectedUser.email;
      this.state.password = this.selectedUser.password;
      this.state.deposit = this.selectedUser.currentBalance;
      this.state.contactNumber = this.selectedUser.contactNo;
    } else {
      this.recurse();
    }
  },
};
</script>

<style></style>
