<template>
  <template v-if="!isAdminPanelPage">
    <Header_vue ></Header_vue>
    <div class="container">
      <router-view/>
    </div>
  </template>
  <template v-else>
    <router-view/>
  </template>
</template>
<script>
import Header_vue from "@/components/header_vue";
export default {
  components: {Header_vue},
  computed: {
    isAdminPanelPage() {
      return (this.$route.name === 'admin' || this.$route.name === 'DashboardPanel') || this.$route.name === 'AdminLots'; // Здесь предполагается, что у страницы "adminPanel" есть имя маршрута "adminPanel"
    },
  }
}
</script>
<style lang="scss">
  body{
    overflow-x: hidden;
  }
</style>
