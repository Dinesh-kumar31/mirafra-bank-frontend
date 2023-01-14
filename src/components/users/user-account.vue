<template>
  <div class="container-fluid">
    <div class="row mt-3 col-8 mx-auto">
      <div class="card text-center">
        <div class="card-header fw-bold">Your Account Information</div>
        <div class="card-body">
          <table class="table table-bordered table-secondary">
            <tbody>
              <tr>
                <td class="fw-bold">Account No:</td>
                <td>123456</td>
              </tr>
              <tr>
                <td class="fw-bold">Account Type:</td>
                <td>Savings</td>
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
export default {
  name: "user-account",
};
</script>
