<template>

  <form @submit.prevent="login" class="login_form">
    <h2>Авторизация</h2>
    <input type="text" v-model="email" name="email" placeholder="email" required>
    <input type="password" v-model="password" name="password" placeholder="Password" required>
    <button type="submit" >Войти</button>
  </form>


</template>

<script>
import axios from "../axios";
export default {
  name: "login_user",
  data(){
    return{
      email: '',
      password: ''
    }
  },
  methods: {
    login(){
      axios.post('/auth/login', {
          email: this.email,
          password: this.password
      })
      .then((res)=> {
        console.log(res)
        const token = res.data.token
        this.$store.dispatch('login', token);
        this.$store.dispatch('user_info', res.data);
      })
      .catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  h2{
    text-align: center;
  }
    .login_form{
        width: 300px;
        z-index: 500;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 20px;
        input{
          border: 1px solid #000;
          padding: 10px;
          border-radius: 25px;
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