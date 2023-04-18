<template>
  <Banner_vue></Banner_vue>
  <Filter_vue></Filter_vue>
  <House_items_list_vue></House_items_list_vue>
</template>

<script>

import Banner_vue from "@/components/banner_vue";
import Filter_vue from "@/components/fillter_vue";
import House_items_list_vue from "@/components/house_items/house_items_list_vue";

export default {
  name: 'HomeView',
  components: {
    House_items_list_vue,
    Filter_vue,
    Banner_vue,
  },
  created() {

  },
  mounted() {
    this.$socket.emit("message", "Hello server!");
  },
}
</script>
