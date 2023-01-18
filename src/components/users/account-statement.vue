<template>
  <div class="container-fluid">
    <div class="row mt-3 col-8 mx-auto">
      <div class="card text-center">
        <div class="card-header fw-bold">
          Transaction made against your account
        </div>
        <div class="card-body">
          <div class="card">
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
                  ><span class="text-capitalize">{{ item.from }}</span> deposit
                  a amount of {{ item.amount }} to you at
                  {{ dateFormat(item.transactionData) }}</span
                >
                <span v-if="item.transactionType === 'deposit'">
                  <span class="text-capitalize"
                    >{{ item.from }} {{ item.transactionType }}
                    {{ item.amount }}</span
                  >
                  to your account {{ accountNumberFormat }} at
                  {{ dateFormat(item.transactionData) }}
                </span>
                <span v-if="item.transactionType === 'withdraw'">
                  <span class="text-capitalize"
                    >{{ item.from }} {{ item.transactionType }}
                    {{ item.amount }}</span
                  >
                  from your account {{ accountNumberFormat }} at
                  {{ dateFormat(item.transactionData) }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-footer text-muted">@Mirafra Bank</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "account-statement",
  data() {
    return {
      userData: {},
      transactionData: [],
      headers: {
        authorization: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      },
    };
  },
  methods: {
    async geAccountData() {
      const url = "api/getUser/" + localStorage.getItem("userId");
      const response = await axios.get(url, { headers: this.headers });
      if (response.data.status === 422) {
        this.logout();
      } else if (response.data.status === 400) {
        console.log(response.data.message);
      } else {
        this.userData = response.data.data;
        this.transactionData = response.data.data.transfer.reverse();
      }
    },
    dateFormat(value) {
      return moment(value).format("DD-MM-YYYY");
    },
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    },
  },
  computed: {
    accountNumberFormat() {
      console.log(this.userData.accountNo);
      let accNo = this.userData.accountNo;
      accNo = accNo
        .toString()
        .split("")
        .map((e, i, arr) => {
          return arr.length / 2 > i ? "x" : e;
        });
      return accNo.join("");
    },
  },
  beforeMount() {
    this.geAccountData();
  },
};
</script>
