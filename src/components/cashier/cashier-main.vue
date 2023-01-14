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
              />
              <button class="btn btn-info mt-3" type="button">
                Get Account Info
              </button>
            </div>
          </div>
        </div>
        <div class="row mx-auto col-10">
          <table class="table table-borderless border table-striped-columns">
            <tbody>
              <tr>
                <td class="fw-bold">Account No:</td>
                <td>12234556</td>
                <td class="fw-bold">Holder Name:</td>
                <td>Dinesh</td>
                <td class="fw-bold">Holder Bank Name:</td>
                <td>Mirafra Bank</td>
                <td class="fw-bold">Bank Balance:</td>
                <td>10000</td>
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
                  />
                </td>
                <td>
                  <button type="button" class="btn btn-info text-capitalize">
                    {{ transaction }}
                  </button>
                </td>
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
import cashierHeader from "./cashier-header.vue";
export default {
  name: "cashier-main",
  data() {
    return {
      transaction: "withdraw",
    };
  },
  components: {
    cashierHeader,
  },
};
</script>
