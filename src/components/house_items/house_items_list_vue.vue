<template>
  <template v-if="isLoading">
    Загрузка...
  </template>
  <tempalte>
    <div class="house_item_list row d-flex align-items-end g-4">
      <House_item_vue v-for="item in houseItems" :key="item.id" :data="item"></House_item_vue>
    </div>
  </tempalte>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import House_item_vue from "@/components/house_items/house_item_vue";
export default {
  name: "house_items_list_vue",
  components: {House_item_vue},
  data: ()=>{
    return {
      dataList: [],
      }
  },
  methods: {
    ...mapActions(['loadItems', 'updateVisibleItems']),
    ...mapGetters(['hasMoreItems']),
    loadMoreItems() {
      this.loadItems();
    },
    handleScroll(){
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOffset = 20;
      if(scrollPosition >= pageHeight - bottomOffset){

        this.$store.dispatch('loadItems');
      }
    }
  },
  created() {
    this.loadMoreItems();
    window.addEventListener('scroll', this.handleScroll);
  },
  computed: {
    ...mapState(['houseItems', 'visibleItems', 'isLoading']),
  },
  mounted() {

  },
}
</script>

<style scoped>
  .house_item_list{
    margin-top: 70px;
   

  }

  @media(max-width: 767px){

  }
</style>
