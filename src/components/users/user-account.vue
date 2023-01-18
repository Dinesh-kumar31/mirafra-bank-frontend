<template>
  <div class="container-fluid">
    <div class="row mt-3 col-8 mx-auto">
      <div class="card text-center">
        <div class="card-header fw-bold">Your Account Information</div>
        <div class="card-body">
          <table class="table table-bordered table-secondary">
            <tbody>
              <tr>
                <td class="fw-bold">Available Balance:</td>
                <td>{{ userData?.currentBalance }}</td>
              </tr>
              <tr>
                <td class="fw-bold">Account No:</td>
                <td>{{ userData?.accountNo }}</td>
              </tr>
              <tr>
                <td class="fw-bold">Account Type:</td>
                <td>{{ userData?.accountType }}</td>
              </tr>
              <tr>
                <td class="fw-bold">Email:</td>
                <td>{{ userData?.email }}</td>
              </tr>
              <tr>
                <td class="fw-bold">Contact No:</td>
                <td>{{ userData?.contactNo }}</td>
              </tr>
              <tr>
                <td class="fw-bold">Created Date:</td>
                <td>{{ dateFormat(userData.created) }}</td>
              </tr>
            </tbody>
          </table>
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
  name: "user-account",
  data() {
    return {
      userData: {},
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
        this.$toast.error("Aunthentication failed");
      } else if (response.data.status === 400) {
        this.$toast.error(response.data.message);
      } else {
        this.userData = response.data.data;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    },
    dateFormat(value) {
      return moment(value).format("DD-MM-YYYY");
    },
  },
  beforeMount() {
    this.geAccountData();
  },
};
</script>
