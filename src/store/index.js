import { createStore } from 'vuex'

export default createStore({
  state: {
    paramsFilter : {
      type: 'All',
      currentCity : 'Алматы',
      currentCityStreet: 'Бостандыкский р-н',
      countRoom : null
    },
    houseItems : [],
    FilterList : []
  },
  getters: {
    getHouseItemById: (state) => (id) => {
      return state.houseItems.find(item => item.id == id);
    },
    getFilteredHouseItems(state) {
      return state.filteredItems;
    }
  },
  mutations: {
    updateParamsFilter(state, params){
      state.paramsFilter = params;
      const filteredItems = state.houseItems.filter((item) => {
        // Фильтрация по цене
        if(item.type == params.type || params == 'All'){
          return true;
        }

        console.log(params.currentCity)
        console.log(item.city)
        return false;
      });
      // Обновление отфильтрованного массива в store
      state.FilterList = filteredItems
    },
    setRealEstate(state, data) {
      state.houseItems = data;
    },
  },
  actions: {
    fetchRealEstate({commit}) {
      fetch('http://localhost:3000/api/data/')
          .then(response => response.json())
          .then(data => {
            commit('setRealEstate', data);
          })
    },
  },
  modules: {
  }
})
