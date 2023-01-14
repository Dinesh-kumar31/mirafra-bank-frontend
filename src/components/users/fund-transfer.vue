<template>
  <div class="container-fluid">
    <div class="row mt-3 col-8 mx-auto">
      <div class="card text-center">
        <div class="card-header fw-bold">Fund Transfer</div>
        <div class="card-body">
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
                />
                <button class="btn btn-info mt-3" type="button">
                  Get Account Info
                </button>
                <hr />
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
                        disabled
                      />
                    </div>
                    <div class="mb-3">
                      <label for="bank-name" class="form-label"
                        >Account Holder Bank Name:</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="bank-name"
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
                      />
                    </div>
                    <div>
                      <button type="button" class="btn btn-small btn-info">
                        Transfer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-start mb-3">
          <div class="card-header">Transfer History</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">An item</li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
          </ul>
        </div>
        <div class="card-footer text-muted">@Mirafra Bank</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fund-transfer",
};
</script>
