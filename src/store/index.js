import { createStore } from 'vuex'
// import {response} from "express";
 import axios from "../axios";
export default createStore({
  state: {
    houseItemsMongo: [],
    houseItems : [],
    detailHouse: [],
    isLoading: false,
    visibleItems: [], // Массив видимых элементов
    batchSize: 10, // Количество элементов для загрузки
    start: 0,
    end: 9,
    endList: false,
    user: {
      data: null,
      status: 'loading'
    },
    userRole: null,
    token: localStorage.getItem('token') || null,
    // Параметры фильтра
    filterParams: {
      type: 'All',
      city: null,
      countRoom: null,
      areaMin: null,
      areaMax: null,
      priceMin: null,
      priceMax: null,
      isNewBuilding: false,
      isUnderConstruction: false
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.end < state.houseItems.length - 1;
    },
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin',
    currentUser: (state) => state.user.data,
    filteredHouses(state) {
      let filtered = [...state.houseItemsMongo];
      const params = state.filterParams;

      // Фильтр по типу недвижимости
      if (params.type && params.type !== 'All') {
        filtered = filtered.filter(house => house.propertyType === params.type);
      }

      // Фильтр по городу
      if (params.city) {
        filtered = filtered.filter(house => house.city === params.city);
      }

      // Фильтр по количеству комнат
      if (params.countRoom) {
        filtered = filtered.filter(house => house.countRoom === params.countRoom);
      }

      // Фильтр по площади
      if (params.areaMin !== null && params.areaMin > 0) {
        filtered = filtered.filter(house => house.area >= params.areaMin);
      }
      if (params.areaMax !== null && params.areaMax > 0) {
        filtered = filtered.filter(house => house.area <= params.areaMax);
      }

      // Фильтр по цене
      if (params.priceMin !== null && params.priceMin > 0) {
        filtered = filtered.filter(house => house.startPrice >= params.priceMin);
      }
      if (params.priceMax !== null && params.priceMax > 0) {
        filtered = filtered.filter(house => house.startPrice <= params.priceMax);
      }

      // Фильтр по новостройкам
      if (params.isNewBuilding) {
        filtered = filtered.filter(house => house.isNewBuilding === true);
      }

      // Фильтр по строящимся домам
      if (params.isUnderConstruction) {
        filtered = filtered.filter(house => house.isUnderConstruction === true);
      }

      return filtered;
    }
  },
  mutations: {
    PUSH_ITEMS_MONGO(state, data){
      state.houseItemsMongo = state.houseItemsMongo.concat(data);
    },
    SET_HOUSE_ITEMS_MONGO(state, data){
      state.houseItemsMongo = data;
    },
    setHouseItems(state, data) {
      state.houseItems = data;
    },
    ADD_ITEMS(state, items){
      state.houseItems = state.houseItems.concat(items);
    },
    SET_LOADING(state, isLoading){
      state.isLoading = isLoading;
    },
    UPDATE_VISIBLE_ITEMS(state){
      state.visibleItems = state.houseItems
    },
    UPDATE_START_END(state){
        state.start += state.batchSize;
        state.end += state.batchSize;
    },
    PUSH_DETAIL_PAGE(state, data){
      state.detailHouse = data;
      console.log(state.detailHouse);
      
    },
    SET_TOKEN(state, token){
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, data){
      state.user.data = data;
      state.user.status = 'loaded';
      state.userRole = data?.role || null;
      if (data) {
        localStorage.setItem('user-info', JSON.stringify(data));
      }
    },
    LOGOUT(state) {
      state.token = null;
      state.user.data = null;
      state.userRole = null;
      state.user.status = 'loading';
      localStorage.removeItem('token');
      localStorage.removeItem('user-info');
    },
    updateParamsFilter(state, params) {
      // Обновление параметров фильтра
      // params содержит обновленные параметры фильтрации
      if (params) {
        // Применить переданные параметры
        Object.assign(state.filterParams, params);
      }
    },
    SET_FILTER_PARAMS(state, params) {
      state.filterParams = { ...state.filterParams, ...params };
    },
    RESET_FILTER_PARAMS(state) {
      state.filterParams = {
        type: 'All',
        city: null,
        countRoom: null,
        areaMin: null,
        areaMax: null,
        priceMin: null,
        priceMax: null,
        isNewBuilding: false,
        isUnderConstruction: false
      };
    }
  },
  actions: {
    loadItemsMongoDB({ commit }){
      commit('SET_LOADING', true);
      axios('/houses', {
        method: 'GET'
      })
          .then((res) => {
            // Используем SET_HOUSE_ITEMS_MONGO чтобы заменить массив, а не добавлять к нему
            commit('SET_HOUSE_ITEMS_MONGO', res.data);
            commit('setHouseItems', res.data);
            commit('UPDATE_VISIBLE_ITEMS');
            commit('SET_LOADING', false);
          })

          .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            commit('SET_LOADING', false);
          });
    },
    loadItems({ commit, state }) {
      // if (state.isLoading || !state.hasMoreItems) return;
      commit('SET_LOADING', true);
      fetch(`http://localhost:3000/api/data?start=${state.start}&end=${state.end}`)
          .then(response => response.json())
          .then(data => {
          
            if (data.length > 0) {
              commit('ADD_ITEMS', data);
              commit('UPDATE_START_END');
            } else {
              console.log('Нет больше элементов для загрузки');
            }
            commit('SET_LOADING', false);
          })
          .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            commit('SET_LOADING', false);
          });
    },
    updateVisibleItems({commit , state}){
      commit('UPDATE_VISIBLE_ITEMS');
      if(state.visibleItems.length === state.houseItems.length){
        //Все елементы загружены
        console.log('Все загруженно')
      }
    },
    async getHouseItemById({commit}, id) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`/houses/${id}`);
        commit('PUSH_DETAIL_PAGE', response.data);
        commit('SET_LOADING', false);
      } catch (error) {
        console.error('Error fetching house details:', error);
        commit('SET_LOADING', false);
      }
    },
    login({commit}, token){
      commit('SET_TOKEN', token)
    },
    user_info({commit}, data){
      commit('SET_USER_INFO', data)
    },
    async fetchCurrentUser({ commit, state }) {
      if (!state.token) return;

      try {
        const response = await axios.get('/auth/me');
        commit('SET_USER_INFO', response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        commit('LOGOUT');
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    applyFilter({ commit }, filterParams) {
      commit('SET_FILTER_PARAMS', filterParams);
    },
    resetFilter({ commit }) {
      commit('RESET_FILTER_PARAMS');
    }
  },
  modules: {

  }
})
