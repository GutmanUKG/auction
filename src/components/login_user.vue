<template>
<!--  <form @submit.prevent="login">-->
<!--    <input type="text" v-model="email" name="email" placeholder="email" required>-->
<!--    <input type="password" v-model="password" name="password" placeholder="Password" required>-->
<!--    <button type="submit">Login</button>-->
<!--  </form>-->

    <v-sheet width="300" class="mx-auto login_form" >
      <v-form fast-fail @submit.prevent="login">
        <v-text-field
            v-model="email"
            label="email"
            :rules="email"
        ></v-text-field>

        <v-text-field
            v-model="password"
            label="password"
            :rules="password"
        ></v-text-field>

        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
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
        console.log(token)
      })
      .then((data) => {
        console.log(data)

      })
    }
  }
}
</script>

<style scoped>

</style>