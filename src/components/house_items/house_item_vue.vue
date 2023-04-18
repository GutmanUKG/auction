<template>
  <div class="item col-3">
    <div class="item_slider" :id="myId">
      <div class="item-imgs-slider">
        <swiper class="swiper" :modules="modules" :pagination="{ clickable: true }" v-if="data.slider_img.length > 1">
          <swiper-slide class="slide" :key="key" v-for="(item ,key) in data.slider_img">
            <img :src="getImgUrl(item)" :alt="name"  >
          </swiper-slide>
        </swiper>
        <div class="item-img" v-else>
          <img :src="noImg" alt="no image">
        </div>
      </div>

      <div class="item-descr">
        <div class="item-name">
          <router-link :to="{name: `detail_house`, params: {id: data.id}}">
            {{data.name}} , {{data.area}}м2 <template v-if="data.year != 0">{{data.year}} г.п</template>
          </router-link>
        </div>
        <div class="item-address">
          {{data.city}} {{data.street}} {{data.adress}}
        </div>
        <div class="item-price">
          <span>Цена</span>
          {{formatNumber(currentPrice)}}
        </div>
        <div class="item-footer">
          <div class="item-time">
            <span>
              Начало:
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99992 17.5001C13.6818 17.5001 16.6666 14.5153 16.6666 10.8334C16.6666 7.15152 13.6818 4.16675 9.99992 4.16675C6.31802 4.16675 3.33325 7.15152 3.33325 10.8334C3.33325 14.5153 6.31802 17.5001 9.99992 17.5001Z" stroke="#333333" stroke-opacity="0.5" stroke-width="1.5" stroke-miterlimit="10"/>
              <path d="M10 10.8333L12.9167 8.75" stroke="#333333" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.33325 1.66675H11.6666" stroke="#333333" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{date}}
          </div>
          <div class="item-people">
             <span>
            Участвуют:
          </span>
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.0026 3.59966C12.6028 3.70809 12.3666 4.12006 12.4751 4.51983C12.5835 4.91961 12.9955 5.15579 13.3952 5.04736L13.0026 3.59966ZM14.3623 4.16675V3.41674L14.36 3.41675L14.3623 4.16675ZM18.6527 8.45718H19.4027H18.6527ZM14.3623 12.7476L14.3618 11.9976C13.9477 11.9979 13.6122 12.3337 13.6123 12.7478C13.6124 13.162 13.9482 13.4976 14.3623 13.4976V12.7476ZM1.08363 15.4022C0.845473 15.7411 0.927144 16.2089 1.26605 16.4471C1.60495 16.6852 2.07275 16.6035 2.3109 16.2646L1.08363 15.4022ZM12.9648 16.2646C13.203 16.6035 13.6708 16.6852 14.0097 16.4471C14.3486 16.2089 14.4302 15.7411 14.1921 15.4022L12.9648 16.2646ZM19.689 16.2643C19.927 16.6033 20.3947 16.6853 20.7338 16.4473C21.0728 16.2093 21.1547 15.7416 20.9167 15.4025L19.689 16.2643ZM11.1783 8.45718C11.1783 10.4125 9.59318 11.9976 7.63786 11.9976V13.4976C10.4216 13.4976 12.6783 11.2409 12.6783 8.45718H11.1783ZM7.63786 11.9976C5.68253 11.9976 4.09743 10.4125 4.09743 8.45718H2.59743C2.59743 11.2409 4.85411 13.4976 7.63786 13.4976V11.9976ZM4.09743 8.45718C4.09743 6.50185 5.68253 4.91675 7.63786 4.91675V3.41675C4.85411 3.41675 2.59743 5.67342 2.59743 8.45718H4.09743ZM7.63786 4.91675C9.59318 4.91675 11.1783 6.50185 11.1783 8.45718H12.6783C12.6783 5.67343 10.4216 3.41675 7.63786 3.41675V4.91675ZM13.3952 5.04736C13.7112 4.96166 14.0371 4.91774 14.3646 4.91674L14.36 3.41675C13.9015 3.41815 13.4451 3.47964 13.0026 3.59966L13.3952 5.04736ZM14.3623 4.91675C15.3013 4.91675 16.2018 5.28976 16.8657 5.95372L17.9264 4.89306C16.9811 3.94779 15.6991 3.41675 14.3623 3.41675V4.91675ZM16.8657 5.95372C17.5297 6.61768 17.9027 7.5182 17.9027 8.45718H19.4027C19.4027 7.12037 18.8717 5.83832 17.9264 4.89306L16.8657 5.95372ZM17.9027 8.45718C17.9027 9.39616 17.5297 10.2967 16.8657 10.9606L17.9264 12.0213C18.8717 11.076 19.4027 9.79398 19.4027 8.45718H17.9027ZM16.8657 10.9606C16.2018 11.6246 15.3013 11.9976 14.3623 11.9976V13.4976C15.6991 13.4976 16.9811 12.9666 17.9264 12.0213L16.8657 10.9606ZM2.3109 16.2646C2.91163 15.4098 3.70926 14.7121 4.63642 14.2304L3.94492 12.8993C2.80415 13.4919 1.82275 14.3504 1.08363 15.4022L2.3109 16.2646ZM4.63642 14.2304C5.56347 13.7488 6.59292 13.4976 7.63786 13.4976V11.9976C6.35246 11.9976 5.08581 12.3066 3.94492 12.8993L4.63642 14.2304ZM7.63786 13.4976C8.6828 13.4976 9.71225 13.7488 10.6393 14.2304L11.3308 12.8993C10.1899 12.3066 8.92326 11.9976 7.63786 11.9976V13.4976ZM10.6393 14.2304C11.5665 14.7121 12.3641 15.4098 12.9648 16.2646L14.1921 15.4022C13.453 14.3504 12.4716 13.4919 11.3308 12.8993L10.6393 14.2304ZM14.3627 13.4976C15.4075 13.497 16.437 13.7481 17.3642 14.2297L18.0556 12.8985C16.9146 12.3058 15.6476 11.9968 14.3618 11.9976L14.3627 13.4976ZM17.3642 14.2297C18.2913 14.7113 19.0888 15.4092 19.689 16.2643L20.9167 15.4025C20.1781 14.3501 19.1966 13.4912 18.0556 12.8985L17.3642 14.2297Z" fill="#333333" fill-opacity="0.5"/>
            </svg>
            <template v-if="activePeople < data.current_people">
              {{data.current_people}}
            </template>
            <template v-else>
              {{activePeople}}
            </template>


          </div>
        </div>
      </div>
      <div class="item-footer">
        <button class="favorite-btn btn ">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="22" fill="#0077E5" fill-opacity="0.1"/>
            <path d="M13 20.0002C13 24.0002 19.4999 28.8464 21.9999 31C24.4999 28.8464 31 24.0002 31 20.0002C31 17.0002 28.9999 15.0001 26.4999 15C24.4999 15.0002 22.9453 16.5142 21.9999 18.2593C21.0594 16.5231 19.4999 14.9999 17.4999 15C14.9999 15.0001 13 17.0002 13 20.0002Z" stroke="#0077E5" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Если еще не участвует-->
        <template  v-if="isStepSecond && stepCount < 1">
          <button class="btn w-100 btn-apply" @click="addCountPeople" >
            Участвовать
          </button>
        </template>
        <!-- участвует-->
        <template  v-else>
          <button class="btn w-100 btn-apply" @click="place" v-if="isStart == false">
            Сделать ставку
          </button>
        </template>

        <!--Участвует и делает ставку-->
          <div class="d-flex flex-column" v-if="isStart && isWin == false">
            <template v-if="isLoseText">
              <span class="text-danger">
                {{youLoseText}}
              </span>
            </template>
            <div class="d-flex">
              <input type="text" name="price" @input="addPrice($event , data.id)">
              <button class="btn btn-primary" @click="updatePrice">OK</button>
            </div>
          </div>
        <template v-if="isStart && isWin == true">
          <div class="btn btn-dark">
            Ваша ставка победная
          </div>
        </template>
      </div>
    </div>
  </div>

</template>

<script>
import { Swiper, SwiperSlide  } from 'swiper/vue';
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import noImg from '@/assets/no-img.jpg'

import audioSrc  from '@/assets/sound/alert.mp3';
export default {
  name: "house_item_vue",

  components: {
    Swiper,
    SwiperSlide,

  },
  props: {
    data: {
      type: Object,
    }
  },
  data : ()=>{
    return{
      audioSrc,
      imgsList : [],
      modules: [Pagination],
      date: '',
      noImg,
      activePeople :0,
      dataSocket: {},
      componentId: 0,
      isStart : false,
      currentPrice : 0,
      price: 0,
      isWin: true,
      isStepSecond: true,
      stepCount : 0,
      youLoseText: 'Ваша ставка перебита',
      isLoseText: false
    }
  },
  methods: {
    place(){
      this.isStart = true;
    },
    addCountPeople(){
      this.isStepSecond = false
      this.stepCount++
      this.isWin = false
      this.activePeople += 1;
      this.dataSocket = {
        id: this.myId,
        count: this.activePeople,
      }
      this.$socket.emit('addPeople', this.dataSocket)

    },
    getImgUrl(pic) {
      return require('/upload/' + pic);
    },
    formattedDate() {
      const dateObj = new Date(this.data.date);
      const day = dateObj.getUTCDate().toString().padStart(2, '0');
      const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getUTCFullYear().toString();
      // const hours = dateObj.getUTCHours().toString().padStart(2, '0');
      // const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
      // const seconds = dateObj.getUTCSeconds().toString().padStart(2, '0');
      this.date = `${day}: ${month}: ${year}г.`;
    },
    addPrice(event){
      this.price = event.target.value
    },
    updatePrice(){
      if(this.price > this.currentPrice){
        this.currentPrice = this.price;
        this.dataSocket = {
          id: this.myId,
          price: this.price,
        }
        this.$socket.emit('updatePrice', this.dataSocket)
        this.isWin = true
      }else{
        console.log('Ошибка число меньше')
      }

    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    activePeopleDB(){
      return this.activePeople = this.data.current_people
    },
    currentPriceDB(){
      return this.currentPrice = this.data.price
    }

  },
  created(){
    this.formattedDate(),
    this.activePeopleDB(),
        this.currentPriceDB()
  },
  computed: {
    myId() {
      return this.data.id;
    },

  },
  mounted(){

    this.$socket.on('counterUpdated', (response) => { // Обработчик события обновления счетчика
      if(this.myId === response.id){
        this.activePeople = response.counter; // Обновляем счетчик в нашем компоненте Vue
      }
    });
    this.$socket.on('PriceUpdated', (response) => { // Обработчик события обновления счетчика
      if(this.myId === response.id){
       this.currentPrice = response.price
        this.isWin = false
        this.isStepSecond = response.isNew
        this.isStepSecond = response.isStart
        this.isLoseText = response.isLoseText
        if(this.isStart && this.isWin == true){
          console.log('play')
          let audio = new Audio(this.audioSrc);
          audio.play()
        }

      }
    });
  }

}
</script>

<style lang="scss" scoped>
  input{
    width: 100%;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 10px;
    font-family: "Inter", sans-serif;
    box-sizing: border-box;
    outline: none;
    border: none;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: rgba(51, 51, 51, 0.75);
  }
  .item{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 600px;
  }
  .item_slider{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .item-img{
    height: 273px;
    img{
      width: 100%;
      object-fit: cover;
      height: 100%;
    }
  }
  .item_slider{
    .slide{
      height: 273px;
      img{
        width: 100%;
        object-fit: cover;
        height: 100%;
      }

    }
    .item-descr{
      padding: 12px;
      box-sizing: border-box;
    }
    .item-name{
      margin-bottom: 16px;
      a{
        font-family: 'Inter',sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
        text-decoration: none;
      }
    }
    .item-address{
      font-family: 'Inter',sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: rgba(51, 51, 51, 0.75);
      margin-bottom: 16px;
    }
    .item-price{
      margin-bottom: 16px;
      span{
        font-family: 'Inter',sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 20px;
        color: rgba(51, 51, 51, 0.5);
        margin-bottom: 4px;
        display: block;
      }
      font-family: 'Inter',sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      color: #333333;
    }
    .item-footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-time,
      .item-people{
        span{
          display: block;
          font-family: 'Inter',sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 13px;
          line-height: 20px;
          color: rgba(51, 51, 51, 0.5);
          margin-bottom: 4px;
        }
        font-family: 'Inter',sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
      }
    }
  }
  .btn-apply{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #FFFFFF;
    padding: 10px 20px;
    gap: 10px;
    background: #0077E6;
    border-radius: 64px;
    &:hover{
      background: #0077E6;
      color: #FFFFFF;
    }
  }
</style>
