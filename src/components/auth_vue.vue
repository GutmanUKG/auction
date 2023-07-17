<template>
  <div class="user-profile">
    <div class="user-info" >
      <div  v-show="isAuthenticated">
        <div class="user-name" @click="togglePopup">
          <template v-if="userInfo.data.fullName">
            {{userInfo.data.fullName}}
          </template>
          <template v-else>
            User
          </template>

        </div>
        <div class="user-popup" v-if="showPopup">
          <ul>
            <li>
              <a href="#">Личный кабинет</a>
            </li>
            <li>
              <a href="#">Избранное</a>
            </li>
            <li>
              <a href="#">Активные торги</a>
            </li>
          </ul>
          <button @click="logout">Выйти</button>
        </div>
      </div>
      <div v-show="!isAuthenticated">
        <button v-if="!isShowLogin" @click="showLoginForm">Войти</button> /  <button v-if="!isShowRegister" @click="showLoginForm">Войти</button> /
      </div>
    </div>
    <Login_user v-if="isShowLogin && !isAuthenticated" ></Login_user>
  </div>

</template>

<script>
import Login_user from "@/components/login_user";
export default {
  name: "auth_vue",
  data: () => {
    return {
      isShowLogin: false,
      showPopup: false,
      isShowRegister: true
    }

  },
  methods: {
    showLoginForm(){
      this.isShowLogin = !this.isShowLogin
    },
    logout(){
      const token = ''
      this.$store.dispatch('login', token);
      this.$store.dispatch('user_info', []);
      this.showPopup = false
    },
    togglePopup(){
      this.showPopup = !this.showPopup
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userInfo(){
      return this.$store.state.user
    }
  },
  watch: {

  },
  components: {Login_user}
}
</script>

<style lang="scss" scoped>
 button{
   font-family: 'Inter',sans-serif;
   font-style: normal;
   font-weight: 500;
   font-size: 16px;
   line-height: 24px;
   color: #FFFFFF;
   background: transparent;
   border: none;
   outline: none;
 }

  .user-info{
    position: relative;
    .user-name{
      text-decoration: none;
      font-family: "Inter", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
 .user-popup{
    position: absolute;
    top: 100%;
    background: #000;
    color: #fff;
    width: 250px;
    padding: 20px;
    left: -100px;
    display: flex;
    flex-direction: column;
    gap: 20px;
   border-radius: 25px;
   ul{
     padding: 0;
     margin: 0;
     display: flex;
     flex-direction: column;
     gap: 10px;
     li{
       list-style: none;
       a{
         text-decoration: none;
         font-family: "Inter", sans-serif;
         font-style: normal;
         font-weight: 500;
         font-size: 16px;
         line-height: 24px;
         color: #fff;
       }
     }
   }
   button{

     background: #0077E6;
     border-radius: 64px;
     padding: 10px 35px;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     font-family: "Inter", sans-serif;
     font-style: normal;
     font-weight: 500;
     font-size: 14px;
     line-height: 24px;
     color: #FFFFFF;
     gap: 10px;
   }
  }
</style>
