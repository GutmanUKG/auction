<template>
  <Header_vue></Header_vue>
  <div class="container">
    <router-view/>
  </div>
</template>
<script>
import Header_vue from "@/components/header_vue";
export default {
  components: {Header_vue}
}
</script>
<style lang="scss">
  body{
    overflow-x: hidden;
  }
</style>
