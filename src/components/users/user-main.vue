<template>
  <userHeader></userHeader>
  <router-view></router-view>
</template>

<script>
import userHeader from "./user-header.vue";
export default {
  name: "user-main",
  components: {
    userHeader,
  },
};
</script>
