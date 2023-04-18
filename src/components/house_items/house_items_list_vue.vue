<template>
  <div class="house_item_list row d-flex align-items-end g-4">
    <template v-if="FilterList < 1">
      <House_item_vue v-for="item in houseItems" :key="item.id" :data="item"></House_item_vue>
    </template>
    <template v-else>
      <House_item_vue v-for="item in FilterList" :key="item.id" :data="item" ></House_item_vue>
    </template>

  </div>
</template>

<script>
// import House_item_vue from "@/components/house_items/house_item_vue";
import { mapState, mapActions } from 'vuex';
import House_item_vue from "@/components/house_items/house_item_vue";
export default {
  name: "house_items_list_vue",
  components: {House_item_vue},
  data: ()=>{
    return {
      dataList: []
      }
  },
  methods: {
    ...mapActions(['fetchRealEstate']),
  },
  created() {

  },
  computed: {
    ...mapState(['houseItems']),
    ...mapState(['FilterList']),

  },
  mounted() {
    this.fetchRealEstate();
  },
}
</script>

<style scoped>
  .house_item_list{
    margin-top: 70px;
  }
</style>
