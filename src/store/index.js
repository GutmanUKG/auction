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
      data: [localStorage.getItem('user-info') || null],
      status: 'loading'
    },
    token: localStorage.getItem('token') || null
  },
  getters: {
    hasMoreItems(state) {
      return state.end < state.houseItems.length - 1;
    },
    isAuthenticated: (state) => !!state.token,
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
    },
    SET_TOKEN(state, token){
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, data){
      state.user.data = data;
      state.user.status = 'loaded';
      localStorage.setItem('user-info', data)
    }
  },
  actions: {
    loadItemsMongoDB({ commit }){
      commit('SET_LOADING', true);
      axios('/lots', {
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
    getHouseItemById({commit} ,id){
      console.log(id)
      console.log(commit)
      fetch(`http://localhost:3000/api/data/${id}`)
          .then(res=> res.json())
          .then(data=>{
            this.state.detailHouse = data;
          })
    },
    login({commit}, token){
      commit('SET_TOKEN', token)
    },
    user_info({commit}, data){
      commit('SET_USER_INFO', data)
    }
  },
  modules: {

  }
})
