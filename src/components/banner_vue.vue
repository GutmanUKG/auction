<template>
  <div class="row banner">
    <div class="col-6">
      <h1>
        Покупай
        недвижимость
        с аукциона!
      </h1>
      <div class="banner-descr col-5 offset-1">
        Здесь вы можете выгодно купить или продать свою недвижимость
      </div>
    </div>
    <div class="col-6 banner-image">
      <img :src="banner" alt="banner">
    </div>
  </div>

</template>

<script>
import banner from '@/assets/main_img.png'

export default {
  name: "banner_vue",
  components: {},
  data: ()=>{
    return{
      banner,
      showBlock: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner{
    display: flex;
    align-items: center;
    margin-top: -120px;
  }
  h1{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 72px;
    line-height: 76px;
    color: #000000;
    position: relative;
    margin-bottom: 80px;
    &:before{
      content: '';
      display: block;
      width: 29.79px;
      height: 26px;
      background: url('../assets/icns/Decor.svg') center/cover no-repeat;
      position: absolute;
      top: -50px;
      right: 150px;
    }
    &:after{
      content: '';
      width: 164px;
      height: 208px;
      background: url('../assets/icns/arr_title.svg') center/cover no-repeat;
      position: absolute;
      top: calc(100% - 50px)
    }
  }
  .banner-descr{
    font-family: 'Inter',sans-serif ;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.5);
  }
  .banner-image{
    position: relative;
    background: linear-gradient(270deg, #4CC5EA 0%, #3AC1E8 47.08%, #41C2E9 56.48%, #00B0E1 100%);
    img{

    }
    &:before{
      content: '';
      display: block;
      position: absolute;
      left: 100%;
      width: calc(100vh );
      background: linear-gradient(270deg, #4CC5EA 0%, #3AC1E8 47.08%, #41C2E9 56.48%, #00B0E1 100%);
      height: 100%;
    }
  }
</style>
