<template>
  <div class="row">
    <div class="col-2 items-list">
      <a href="/" class="logo">
        <picture>
          <img :src="getImgUrl('logo.svg')" alt="">
        </picture>
      </a>
      <ul class="menu-list">
        <li>
          <router-link to="/admin">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/dashboard">User Profile</router-link>
        </li>
        <li>
          <router-link to="/adminLots">Lots</router-link>
        </li>
      </ul>
    </div>
    <div class="col-10">
      Тут функцтонал лотов (добавление, удаление, изменение )
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLots",
  methods:{
    getImgUrl(pic) {
      return require('/upload/' + pic);
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-list{
  position: relative;
  z-index: 4;
  padding: 50px 0 0 0;
  margin: 0;
  li{
    list-style: none;
    margin-top: 10px;
    a{
      text-decoration: none;
      display: flex;
      padding: 10px 15px;
      border-radius: 3px;
      margin: 0;
      line-height: 30px;
      font-size: 14px;
      position: relative;
      font-weight: 300;
      white-space: nowrap;
      color: #fff;
      transition: .3s all;
      &.router-link-active{
        background-color: #4caf50!important;
        -webkit-box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
        box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
        &:hover{
          background-color: #4caf50!important;
          -webkit-box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
          box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
        }
      }

      &:hover{
        background-color: hsla(0,0%,78.4%,.2)!important;
      }

    }
  }
}
.items-list{
  padding: 25px;
  box-sizing: border-box;
  -webkit-box-shadow: 0 10px 30px -12px rgba(0,0,0,.42), 0 4px 25px 0 rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.2);
  box-shadow: 0 10px 30px -12px rgba(0,0,0,.42), 0 4px 25px 0 rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.2);
  background-size: cover;
  background-position: 50%;
  margin: 0;
  height: 100vh;
  background-image: url("../../assets/bg-admin.jpg");
  -webkit-tap-highlight-color: transparent;
  z-index: 1;
  position: relative;
  &:after{
    display: block;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(27,27,27,.87);
    opacity: .85;
    top: 0;
    left: 0;
    z-index: 2;
  }
}
.logo{
  padding: 15px 0;
  position: relative;
  width: 100%;
  display: block;

  z-index: 4;
  &:after{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    left: 0;
    right: 0;
    background: hsla(0,0%,70.6%,.3);
    top: calc(100% + 25px);
    position: absolute;
  }
}
</style>