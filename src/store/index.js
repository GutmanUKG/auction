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
    token: localStorage.getItem('token') || null
  },
  getters: {
    hasMoreItems(state) {
      return state.end < state.houseItems.length - 1;
    },
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin',
    currentUser: (state) => state.user.data,
  },
  mutations: {
    PUSH_ITEMS_MONGO(state, data){
      state.houseItemsMongo = state.houseItemsMongo.concat(data);
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
        Object.assign(state.paramsFilter, params);
      }
    }
  },
  actions: {
    loadItemsMongoDB({ commit }){
      commit('SET_LOADING', true);
      axios('/houses', {
        method: 'GET'
      })
          .then((res) => {
            commit('PUSH_ITEMS_MONGO', res.data);
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
    }
  },
  modules: {

  }
})
