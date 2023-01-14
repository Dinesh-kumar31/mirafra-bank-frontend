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
          @click="openAddAccount"
        >
          Add New Account
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
      ></button>
    </div>
    <div class="offcanvas-body" v-if="isOpenAddAccountForm">
      <AddAccountForm />
    </div>
  </div>
</template>

<script setup>
const headers = [
  { text: "Holder Name", value: "player" },
  { text: "Account No.", value: "team" },
  { text: "Branch Name", value: "number" },
  { text: "Current Balance", value: "position" },
  { text: "Account type", value: "indicator.height" },
  { text: "Contact", value: "indicator.weight" },
  { text: "Action", value: "action" },
];

const items = [
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
];
</script>

<script>
import AddAccountForm from "./add-account-form.vue";
export default {
  name: "user-list",
  data() {
    return {
      isOpenAddAccountForm: false,
    };
  },
  components: {
    AddAccountForm,
  },
  methods: {
    openAddAccount() {
      this.isOpenAddAccountForm = false;
      setTimeout(() => {
        this.isOpenAddAccountForm = true;
      }, 100);
    },
  },
};
</script>
