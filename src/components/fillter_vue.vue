<template>
  <div class="filter">
    <div class="filter_top">
      <ul v-if="!isLoadingFilterOptions">
        <li>
          <a href=""
                @click.prevent="handleFilter('All')"
                :class="{active: activeFilter === 'All'}" > Все </a>
        </li>
        <li v-for="propertyType in filterOptions.propertyTypes" :key="propertyType">
          <a href=""
                @click.prevent="handleFilter(propertyType)"
                :class="{active: activeFilter === propertyType}">{{ propertyType }}</a>
        </li>
      </ul>
      <div v-else class="loading-filters">
        Загрузка фильтров...
      </div>
    </div>
     <div class="filter_body row">
       <div class="col-5">
         <City_list
           :cities="filterOptions.cities"
           @currentCitySelect="updateCity"
           @currentStreetSelect="updateStreet">
         </City_list>
         <div class="filter_room-wrapper" v-if="filterOptions.roomCounts.length > 0">
           <ul class="filter_room_count">
             <li
               v-for="roomCount in filterOptions.roomCounts"
               :key="roomCount"
               @click="updateCurrentRoom(roomCount)"
               :class="{active: paramsFilter.countRoom == roomCount || (paramsFilter.countRoom == null && roomCount === filterOptions.roomCounts[0])}">
               {{ roomCount }}
             </li>
           </ul>
           – комнатная
         </div>
          <div class="d-flex gap-1 mt-5">
            <Check_filter_vue name="new_house" title="В новостройках" @checkList="checkListFilter"></Check_filter_vue>
            <Check_filter_vue name="build_house" title="В строящихся домах" @checkList="checkListFilter"></Check_filter_vue>
            <Check_filter_vue name="with_photo" title="C фото" @checkList="checkListFilter"></Check_filter_vue>
          </div>
       </div>
      <div class="col-3">
        <Selector_vue
          title="Площадь, м2"
          :min="filterOptions.areaRange.min"
          type="м2"
          :max="filterOptions.areaRange.max"
          @areaChange="updateSelectArea">
        </Selector_vue>
      </div>
       <div class="col-4">
         <Selector_vue
           title="Цена, ₸ "
           :min="filterOptions.priceRange.min"
           :max="filterOptions.priceRange.max"
           type="₸"
           @areaChange="updateSelectPrice">
         </Selector_vue>
       </div>
     </div>
    <div class="filter_footer row align-center d-flex">
      <div class="col-2">
        <button @click="ClearFilter" v-if="showClearBtn" class="btn btn-clear">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.00008 5.99988L18 17.9998M6 17.9999L17.9999 5.99995" stroke="#0077E5" stroke-width="1.5" stroke-linecap="round"/>
          </svg>

          Очистить
        </button>
      </div>
      <div class="col-7 d-flex justify-content-center">
        <button @click="updateList" class="btn btn-apply">
          Показать результаты
          <span v-if="isLoadingCount" class="btn-loader"></span>
          <span v-else class="btn-count">({{ filteredCount }})</span>
        </button>
      </div>
    
    </div>


  </div>
</template>

<script>
import City_list from "@/components/city_list";
import Selector_vue from "@/components/selector_vue";
import Check_filter_vue from "@/components/check_filter_vue";
import axios from '../axios';

export default {
  name: "fillter_vue",
  components: {Check_filter_vue, Selector_vue, City_list},
  data: ()=>{
    return {
      activeFilter: "All",
      paramsFilter : {
        type: 'All',
        currentCity : 'Алматы',
        currentCityStreet: 'Бостандыкский р-н',
        countRoom: null,
        areaMin: "0",
        areaMax:  "0",
        priceMin: "0",
        priceMax: "0",
        checkObj : {
          isPhoto : false,
          isNewHouse : false,
          isBuildHouse : false
        }

      },
      showClearBtn: true,
      // Динамические данные фильтра из БД
      filterOptions: {
        propertyTypes: [],
        cities: [],
        countries: [],
        priceRange: { min: 0, max: 0 },
        areaRange: { min: 0, max: 0 },
        roomCounts: []
      },
      isLoadingFilterOptions: false,
      isLoadingCount: false
      }
  },
  methods: {
    async loadFilterOptions() {
      try {
        this.isLoadingFilterOptions = true;
        const response = await axios.get('/houses/filter/options');

        // Преобразуем строковые значения в числа
        this.filterOptions = {
          ...response.data,
          priceRange: {
            min: parseFloat(response.data.priceRange.min) || 0,
            max: parseFloat(response.data.priceRange.max) || 0
          },
          areaRange: {
            min: parseFloat(response.data.areaRange.min) || 0,
            max: parseFloat(response.data.areaRange.max) || 0
          }
        };

        console.log('Filter options loaded:', this.filterOptions);

        // Обновляем диапазоны в компонентах селекторов
        this.$nextTick(() => {
          // Данные загружены, компоненты обновятся через props
        });
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        this.isLoadingFilterOptions = false;
      }
    },
    ClearFilter(){
      this.paramsFilter = {
        type: 'All',
        currentCity : 'Алматы',
        currentCityStreet: 'Бостандыкский р-н',
        countRoom: null,
        areaMin: "0",
        areaMax: "0",
        priceMin: "0",
        priceMax: "0",
        checkObj: {
          isPhoto: false,
          isNewHouse: false,
          isBuildHouse: false
        }
      }
      this.showClearBtn = false
      this.$store.dispatch('resetFilter');
      this.activeFilter = 'All';
    },
    handleFilter (filter){
      this.activeFilter = filter;
      this.$emit('filter-change', filter)
      this.paramsFilter.type = filter
      this.showClearBtn = true
    },
    updateCity(city){
      this.paramsFilter.currentCity = city
      this.showClearBtn = true
    },
    updateStreet(street){
      this.paramsFilter.currentCityStreet = street
      this.showClearBtn = true
    },
    updateCurrentRoom(count){
      this.paramsFilter.countRoom = count
      this.showClearBtn = true
    },
    updateList(){
      // Применяем фильтр через store
      const filterParams = {
        type: this.paramsFilter.type,
        city: this.paramsFilter.currentCity === 'Алматы' ? null : this.paramsFilter.currentCity,
        countRoom: this.paramsFilter.countRoom,
        areaMin: parseFloat(this.paramsFilter.areaMin) || null,
        areaMax: parseFloat(this.paramsFilter.areaMax) || null,
        priceMin: parseFloat(this.paramsFilter.priceMin) || null,
        priceMax: parseFloat(this.paramsFilter.priceMax) || null,
        isNewBuilding: this.paramsFilter.checkObj.isNewHouse,
        isUnderConstruction: this.paramsFilter.checkObj.isBuildHouse
      };

      console.log('Applying filter:', filterParams);
      this.$store.dispatch('applyFilter', filterParams);
      console.log('Filter applied, check store state');
    },
    updateSelectArea(area){
      this.showClearBtn = true;
     this.paramsFilter.areaMin = area.selectedMin
     this.paramsFilter.areaMax = area.selectedMax
    },
    updateSelectPrice(area){
      this.showClearBtn = true;
      this.paramsFilter.priceMin = area.selectedMin
      this.paramsFilter.priceMax = area.selectedMax
    },
    checkListFilter(currentCheck){
      this.showClearBtn = true;
      if(currentCheck == 'new_house'){
        this.paramsFilter.checkObj.isNewHouse = !this.paramsFilter.checkObj.isNewHouse
      }
      if(currentCheck == 'build_house'){
        this.paramsFilter.checkObj.isBuildHouse = !this.paramsFilter.checkObj.isBuildHouse
      }
      if(currentCheck == 'with_photo'){
        this.paramsFilter.checkObj.isPhoto = !this.paramsFilter.checkObj.isPhoto
      }
    }
  },
  mounted() {
    this.loadFilterOptions();
  },
  computed: {
    filteredCount() {
      // Получаем отфильтрованные лоты из store
      return this.$store.getters.filteredHouses?.length || 0;
    }
  },
  watch: {
    paramsFilter: {
      handler() {
        // Показываем лоадер при изменении параметров
        this.isLoadingCount = true;
        setTimeout(() => {
          this.isLoadingCount = false;
        }, 300);
      },
      deep: true
    },
    '$store.state.isLoading'(newVal) {
      // Синхронизируем лоадер с состоянием загрузки из store
      this.isLoadingCount = newVal;
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter{
    padding: 0 40px;
    box-sizing: border-box;
    margin-top: calc( 0px - (62px + 44px));
    background: #FFFFFF;
    z-index: 100;
    position: relative;
    .filter_top{
      padding:  32px 0px;
      border-bottom: 1px solid  rgba(0, 0, 0, 0.1);;
      ul{
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
        li{
          list-style: none;
          a{
            text-decoration: none;
            display: block;
            padding:10px 20px;
            border-radius: 44px;
            font-family: 'Inter',sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 24px;
            color: #333333;
            transition: .3s all;
            &.active{
              background: #0054D2;
              color: #FFFFFF;
            }
          }
        }
      }
    }
    .filter_body{
      padding: 24px 0;
    }
  }
  .filter_room_count{
    display: flex;
    margin: 0;
    padding: 0;
    gap: 4px;

    li{
      list-style: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0px;
      gap: 10px;
      width: 28px;
      height: 28px;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      font-family: 'Inter',sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 24px;
      text-align: center;
      color: rgba(51, 51, 51, 0.75);
      transition: .3s all;
      &.active{
        background: #0077E5;
        color: #fff;
      }
    }
  }
  .filter_room-wrapper{
    margin-top: 26px;
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: rgba(51, 51, 51, 0.75);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-apply{
    background: #0077E6;
    border-radius: 64px;
    padding: 10px 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #FFFFFF;
    gap: 10px;
    &:hover{
      background: #0077E6;
      color: #FFFFFF;
    }
  }
  .btn-clear{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #0077E5;
    display: flex;
    align-items: center;
    outline: none;
    svg{
      transition: .3s all;
    }
    &:hover{
      color: #0077E5;
      svg{
        transform: rotate(180deg)
      }
    }
  }
  .loading-filters{
    padding: 20px;
    text-align: center;
    font-family: 'Inter',sans-serif;
    font-size: 14px;
    color: rgba(51, 51, 51, 0.75);
  }

  .btn-count{
    margin-left: 8px;
    font-weight: 600;
    opacity: 0.9;
  }

  .btn-loader {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
