<template>
  <div class="row" :id="detailHouse.id">
    <div class="col-10">
      <h1>
        {{ detailHouse.name }}
      </h1>
      <template v-if="imgsList.length > 0">
        <swiper class="swiper" v-if="imgsList.length > 1">
          <swiper-slide class="slide"  v-for="(item,idx) in imgsList" :key="idx">
            <img :src="getImgUrl(item)" :alt="detailHouse.name"  >
          </swiper-slide>
        </swiper>
      </template>
    <template v-else>
      <picture>
        <img :src="noImg" alt="no image">
      </picture>
    </template>  
    </div>
    <div class="col-2">
      info
    </div>
  </div>
</template>

<script>

 import { Swiper, SwiperSlide  } from 'swiper/vue';
import 'swiper/css'
import 'swiper/css/pagination'
import noImg from '@/assets/no-img.jpg'
import {mapState} from "vuex";

export default {
  name: "Detail_house",
  props: ['id'],
  data : ()=>{
    return{
      noImg,
      imgsList: [],
    }
  },
  methods: {
    getImgUrl(pic) {
       return require('/upload/' + pic);
    },
    setItem(item) {
      this.item = item;
    },
    splitString(str) {
      let string = str;
      let array = string.split(",\r\n");
      return array
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  computed: {
    ...mapState(['detailHouse']),
  },
  
  watch: {
    'detailHouse.slider_img' : {
      handler(newVal) {
        this.imgsList = this.splitString(newVal);
      }
    }
  },
  created() {
    this.$store.dispatch('getHouseItemById', this.id);
    
  }
}
</script>

<style scoped>
  body{
    background: #ccc;
  }
</style>
