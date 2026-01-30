<template>
  <div class="city_list">

      <div class="city_list-current">
        <div class="city_list-wrapper">
          <div class="city-name" @click="showList(1)">
            <img :src="iconGeo" alt=""> {{currentCity}}
          </div>
          
        </div>
      </div>
      <ul class="city_list-city" v-if="step == 1">
        <li v-for="city in cities" :key="city" @click="currentCitySelect(city)">
          {{ city }}
        </li>
      </ul>
     
    
    </div>
</template>

<script>
import iconGeo from '@/assets/icns/MapPin.svg'

export default {
  name: "city_list",
  components: {},
  props: {
    cities: {
      type: Array,
      default: () => ['Алматы', 'Астана', 'Усть-Каменогорск']
    }
  },
  data: ()=>{
    return {
      currentCity: "Алматы",
      currentStreet : "Бостандыкский р-н",
      step: 0,
      iconGeo,

    }
  },
  methods:{
    currentCitySelect(city){
      this.currentCity = city;
      this.step = 2
      this.$emit('currentCitySelect', city)
    },
    currentStreetSelect(street){
      console.log(street)
      this.currentStreet = street
      this.step = 0
      this.$emit('currentStreetSelect', street)
    },
    showList(id){
      this.step = id
    }
  }
}
</script>

<style lang="scss" scoped>
.victim {
  padding: 20px;
  background: #0077e6;
  color: white;
  border-radius: 12px;
  display: inline-block;
  cursor: pointer;
}
.disintegration-container{
  background: red;
}
  .city_list{
    cursor: pointer;
    position: relative;
    .city_list-current{
      display: flex;
    }

  }
  .city_list-city,
  .city_list-street{
    position: absolute;
    margin: 0;
    background: #fff;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    li{
      list-style: none;
    }
  }
  .city-name{
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-decoration-line: underline;
    color: #333333;
  }
  .city_list-wrapper{
    display: flex;
    align-items: center;
  }
</style>
