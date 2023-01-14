<template>
  <managerHeader></managerHeader>
  <router-view></router-view>
</template>

<script>
import managerHeader from "./manager-header.vue";
export default {
  name: "manger-main",
  components: {
    managerHeader,
  },
};
</script>
