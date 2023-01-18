<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand">
        <img
          src="../../../src/assets/navbar-bank.jpg"
          style="width: 35px"
          alt=""
        />
        Mirafra Bank
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="useraccount">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="accountstatement"
              >Accounts Statement</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="fundtransfer"
              >Fund Transfer</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <a
              class="nav-link text-dark"
              aria-current="page"
              href="javascript:void(0)"
              >Welcome</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              aria-current="page"
              @click="logout"
              href="javascript:void(0)"
              >Logout</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "manger-header",
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    },
  },
};
</script>
