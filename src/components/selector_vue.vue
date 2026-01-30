<template>
  <div>
    <div class="range-title">
      {{title}}
    </div>
    <div class="d-flex flex-column">
      <div class="d-flex input-wrapper">
        <label for="min">
          От:
          <input type="text" id="min" :placeholder="min" :value="formatNumber(areaSize.selectedMin)" @input="SelectInputMin">
        </label>
        <label for="max">
          До:
          <input type="text" id="max" :placeholder="max" :value="formatNumber(areaSize.selectedMax)" @input="SelectInputMax">
        </label>
      </div>
        <div class="input-range">
          
          <input type="range" id="min-range" @input="SelectInputMin" :value="areaSize.selectedMin" :max="max" min="0">
          <input type="range" id="max-range" @input="SelectInputMax" :value="areaSize.selectedMax" :max="max">
        </div>
      </div>

  </div>
</template>

<script>
import {watch} from "vue";
import { formatNumber as formatNum } from '@/utils/helpers';

export default {
  name: "selector_vue",
  data () {
  return {
      areaSize : {
        selectedMin : parseInt(this.min),
        selectedMax : parseInt(this.max)
      }
    }
  },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Фильтр диапазона'
    },
    min: {
      type: Number,
      required: true,
      default: 0
    },
    max: {
      type: Number,
      required: true,
      default: 100
      },
    type: {
      type: String,
      required: true,
    }
  },
  methods: {
    SelectInputMin(event){
      this.areaSize.selectedMin = event.target.value
    },
    SelectInputMax(event){
      this.areaSize.selectedMax = event.target.value
    },
    formatNumber(num) {
      return formatNum(num, this.type);
    }
  },
  mounted() {
    watch(() => this.areaSize, (newValue) => {
      this.$emit('areaChange', newValue)
    }, { deep: true });
  }
}
</script>

<style lang="scss" scoped>
  .range-title{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #333333;
  }
  .input-wrapper{
    display: flex;
    gap: 16px;
    margin-top: 28px;
    margin-bottom: 28px;
    label{
      width: 50%;
      input{
        width: 100%;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 10px;
        font-family: 'Inter',sans-serif;
        box-sizing: border-box;
        outline: none;
        border:none;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        color: rgba(51, 51, 51, 0.75);
      }
    }
  }
  #min-range{
    
  }
  .input-range{
    display: flex;
    align-items: center;
    gap: 1rem;
    input{
      width: 50%;
    }
    #max-range{
      margin-left: -10px;
    }
  }
</style>
