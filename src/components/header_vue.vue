<template>
  <header>

      <router-link to="/">
        <img :src="logo" alt="logo">
      </router-link>
      <nav>
        <ul>
          <li>
            <router-link to="/">Главная</router-link>
          </li>
          <li>
            <router-link to="/about">Продать недвижимость </router-link>
          </li>
          <li>
            <router-link to="/about">О нас</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin" class="admin-link">Админ панель</router-link>
          </li>
        </ul>
        <Auth_vue></Auth_vue>
      </nav>


  </header>
</template>

<script>
import logo from '@/assets/logo.svg'
import Auth_vue from "@/components/auth_vue";


export default {
  name: "header_vue",
  components: {Auth_vue},
  data: ()=>{
    return{
      logo
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    position:relative;
    width: 100%;
    z-index: 100;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav{
      display: flex;
      gap: 120px;
      align-items: center;
      ul{
        display: flex;
        gap: 50px;
        margin: 0;
        padding: 0;
        li{
          list-style: none;
          a{
            text-decoration: none;
            font-family: 'Inter',sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            color: #000;

            &.admin-link {
              color: #4caf50 !important;
              font-weight: 600 !important;
            }
          }
        }
      }
    }
  }
</style>
