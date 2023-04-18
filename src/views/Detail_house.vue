<template>
  <h1>{{houseItem.name}}</h1>
  <div class="row">
    <div class="col-9">
      <div class="item-imgs-slider">
        <swiper class="swiper" v-if="houseItem.slider_img.length > 1">
          <swiper-slide class="slide" :key="key" v-for="(item ,key) in houseItem.slider_img">
            <img :src="getImgUrl(item)" :alt="name"  >
          </swiper-slide>
        </swiper>
        <div class="item-img" v-else>
          <img :src="noImg" alt="no image">
        </div>
      </div>
    </div>
    <div class="col-3">
      <div class="item">
        Год : {{houseItem.year}}
      </div>
      <div class="item">
        Цена : {{houseItem.price}}
      </div>
      <div class="item">
        Местоположение : {{houseItem.city}} , {{houseItem.street}}
      </div>
      <div class="item">

      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      {{houseItem.detail_text}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide  } from 'swiper/vue';
import 'swiper/css'
import 'swiper/css/pagination'
import noImg from '@/assets/no-img.jpg'

export default {
  name: "Detail_house",
  props: ['id'],
  data : ()=>{
    return{
      noImg,
      imgsList: [],
      item: null
    }
  },
  methods: {
    getImgUrl(pic) {
      return require('/upload/' + pic);
    },
    setItem(item) {
      this.item = item;
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  computed: {
    ...mapGetters(['getHouseItemById']),
    houseItem() {
      return this.getHouseItemById(this.id);
    }
  },
  created() {
    if (!this.houseItem) {
      this.$store.dispatch('fetchRealEstate').then(() => {
        this.item = this.getHouseItemById(this.id);
      });
    } else {
      this.item = this.houseItem;
    }
  },
}
</script>

<style scoped>
  body{
    background: #ccc;
  }
</style>
