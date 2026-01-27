<template>
  <div class="create-house-page">
    <CreateHouse />
  </div>
</template>

<script>
import CreateHouse from '@/components/CreateHouse.vue';

export default {
  name: 'CreateHousePage',
  components: {
    CreateHouse
  }
}
</script>

<style scoped>
.create-house-page {
  min-height: 100vh;
}
</style>
