<template>
    <div class="city_list">
      <div class="city_list-current">
        <div class="city_list-wrapper">
          <div class="city-name" @click="showList(1)">
            <img :src="iconGeo" alt=""> {{currentCity}}
          </div>,
          <div class="city-name" @click="showList(2)">
            {{currentStreet}}
          </div>
        </div>
      </div>
      <ul class="city_list-city" v-if="step == 1">
        <li @click="currentCitySelect('Усть-Каменогорск')">
          Усть-Каменогорск
        </li>
        <li @click="currentCitySelect('Алматы')">
          Алматы
        </li>
        <li @click="currentCitySelect('Астана')">
          Астана
        </li>
      </ul>
      <ul class="city_list-street" v-if="step == 2">
        <li @click="currentStreetSelect('Бостандыкский р-н')">
          Бостандыкский р-н
        </li>
        <li @click="currentStreetSelect('Назарбаевский р-н')">
          Назарбаевский р-н
        </li>
        <li  @click="currentStreetSelect('Уланский р-н')">
          Уланский р-н
        </li>
      </ul>
    </div>
</template>

<script>
import iconGeo from '@/assets/icns/MapPin.svg'
export default {
  name: "city_list",
  data: ()=>{
    return {
      currentCity: "Алматы",
      currentStreet : "Бостандыкский р-н",
      step: 0,
      iconGeo
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
