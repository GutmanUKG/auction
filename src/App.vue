<template>
  <template v-if="!isAdminPanelPage">
    <Header_vue ></Header_vue>
  
    <div class="container">
      <router-view/>
    </div>
  </template>
  <template v-else>
    <router-view/>
  </template>
</template>
<script>
import Header_vue from "@/components/header_vue";
export default {
  components: {Header_vue},
  computed: {
    isAdminPanelPage() {
      return (this.$route.name === 'admin' || this.$route.name === 'DashboardPanel') || this.$route.name === 'AdminLots'; // Здесь предполагается, что у страницы "adminPanel" есть имя маршрута "adminPanel"
    },
  }
}
</script>
<style lang="scss">
  body{
    overflow-x: hidden;
  }
  .disintegration-container {
    position: absolute;
    pointer-events: none;

    > canvas {
      position: absolute;
      left: 0;
      top: 0;
      transition: transform 1s ease-out, opacity 1s ease-out;
      opacity: 1;
      transform:
          rotate(0deg) translate(0px, 0px) rotate(0deg);
    }
  }

  @keyframes debug-pulse {
    0% { filter: none; }
    95% { filter: none; }
    95% { filter: drop-shadow(0 1px 0 rgba(255,0,0,1)); }
    100% { filter: drop-shadow(0 1px 0 rgba(255,0,0,1)); }
  }

  /* == Normal styling below == */
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #eee;
    font-family: Roboto, sans-serif;
  }

  .item {
    max-width: 60ch;
    background: #fff;
    margin-bottom: 1em;
    padding: 1em;
    border-radius: 5px;
    border: 1px solid #ddd;

    h1 { margin-top: 0; }
    p { margin-bottom: 0; }
    img { float: right; }
  }
  @keyframes debug-pulse {
    0%   { filter: none; outline-color: red; }
    100% { filter: drop-shadow(0 0 8px red); outline-color: yellow; }
  }
</style>
