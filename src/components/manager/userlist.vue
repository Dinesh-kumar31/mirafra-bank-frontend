<template>
  <div class="container-fluid">
    <div class="row mt-3">
      <div class="mb-3 d-md-flex justify-content-md-between">
        <h5 class="fw-bold">Accounts List</h5>
        <button
          class="btn btn-sm btn-success me-md-2"
          aria-controls="offcanvasTop"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasTop"
          @click="openAddAccount(null, false)"
        >
          Add New Account
        </button>
      </div>

      <EasyDataTable
        show-index
        :headers="headers"
        :loading="loading"
        :items="userList"
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
              class="me-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasTop"
              @click="openAddAccount(item, true)"
              >Edit</a
            >
            <a href="javascript:void(0)" @click="deleteUser(item)">Delete</a>
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>
  <div
    class="offcanvas offcanvas-top h-100"
    tabindex="-1"
    id="offcanvasTop"
    aria-labelledby="offcanvasTopLabel"
  >
    <div class="offcanvas-header">
      <h5 id="offcanvasTopLabel">Add New Account</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        id="offcanvas-close"
      ></button>
    </div>
    <div class="offcanvas-body" v-if="isOpenAddAccountForm">
      <AddAccountForm
        :selected-user="selectedUser"
        :isEdit="isEdit"
        @user-added="closeCanvas()"
      />
    </div>
  </div>
</template>

<script setup>
const headers = [
  { text: "Holder Name", value: "name" },
  { text: "Account No.", value: "accountNo" },
  { text: "Current Balance(₹)", value: "currentBalance" },
  { text: "Account type", value: "accountType" },
  { text: "Contact", value: "contactNo" },
  { text: "Action", value: "action" },
];
</script>

<script>
import AddAccountForm from "./add-account-form.vue";
import axios from "axios";

export default {
  name: "user-list",
  data() {
    return {
      isOpenAddAccountForm: false,
      userList: [],
      loading: false,
      selectedUser: {},
      isEdit: false,
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  components: {
    AddAccountForm,
  },
  methods: {
    openAddAccount(data, type) {
      this.selectedUser = data;
      this.isEdit = type;
      this.isOpenAddAccountForm = false;
      setTimeout(() => {
        this.isOpenAddAccountForm = true;
      }, 100);
    },
    async getAllUsers() {
      try {
        this.loading = true;
        var url = "api/getUsers";
        const response = await axios.get(url, { headers: this.headers });
        if (response.data.status === 200) {
          this.userList = response.data.data;
        } else {
          console.log(response.data.message);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async deleteUser(data) {
      try {
        console.log(data);
        const url = "api/deleteUser/" + data?._id;
        const response = await axios.delete(url, { headers: this.headers });
        if (response.data.status === 200) {
          this.getAllUsers();
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    closeCanvas() {
      document.getElementById("offcanvas-close").click();
      this.getAllUsers();
    },
  },
  beforeMount() {
    this.getAllUsers();
  },
};
</script>
