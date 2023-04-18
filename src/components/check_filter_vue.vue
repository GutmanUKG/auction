<template>
  <label :for="name">
    <input type="checkbox" :id="name" :placeholder="title" @click="isChecked($event)" :class="{active: isCheck}" :value="name">
    {{title}}
  </label>
</template>

<script>
export default {
  name: "check_filter_vue",
  data: ()=> {
    return  {
      isCheck: false
    }
  },
  props: {
    name: {
      type: String,
    },
    title: {
      type: String
    }
  },
  methods: {
    isChecked(event){
      this.isCheck = !this.isCheck
      this.$emit('checkList', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  label{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(51, 51, 51, 0.75);
    display:flex;
    align-items: center;
    gap: 5px;
    input{

    }
  }
</style>
