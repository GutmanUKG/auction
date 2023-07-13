<template>

  <button v-if="isAuthenticated">Выйти</button>
  <button v-else @click="showLoginForm">Войти</button>
  <Login_user v-if="isShowLogin" ></Login_user>
</template>

<script>
import Login_user from "@/components/login_user";
export default {
  name: "auth_vue",
  data: () => {
    return {
      isShowLogin: false
    }

  },
  methods: {
    showLoginForm(){
      this.isShowLogin = true
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  watch: {

  },
  components: {Login_user}
}
</script>

<style scoped>
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
</style>
