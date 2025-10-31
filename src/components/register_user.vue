<template>

  <form @submit.prevent="register" class="login_form">
    <div class="close" @click="closeForm">Close</div>
    <h2>Регистрация</h2>
    <input type="text" v-model="fullName" name="fullName" placeholder="ФИО" required>
    <input type="text" v-model="phone" name="phone" placeholder="+7" required>
    <input type="text" v-model="email" name="email" placeholder="email" required>
    <input type="password" v-model="password" name="password" placeholder="Password" required>
    <button type="submit" >Отправить</button>
  </form>


</template>
<script>
import axios from "../axios";

export default {
  name : "register_user",
  emits: ['registered', 'showLoginForm'],
  data() {
    return {
      email : '',
      password : '',
      fullName : '',
      phone: '',

    }
  },
  methods : {
    register() {
      axios.post('auth/register', {
        email: this.email,
        password: this.password,
        fullName : this.fullName,
        phone: this.phone
      })
          .then((res)=>{
            console.log(res)
            const token = res.data.token;
            this.$store.dispatch('login', token);
            this.$store.dispatch('user_info', res.data);
            if (res.status == 200 && res.statusText == 'OK'){
              this.$emit('registered', true);
            }
          })
    },
    closeForm(){
      this.$emit('showLoginForm', false);
    }
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