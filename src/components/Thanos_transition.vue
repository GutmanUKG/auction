<template>
  <div v-if="visible" class="snap-container" ref="container">
    <slot />
  </div>
</template>
<script >
import html2canvas from 'html2canvas';
import { generateFrames, replaceElementVisually } from '../transitions/thanosUtils';

export default {
  name: 'ThanosTransition',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    duration: {
      type: Number,
      default: 1200 // ms
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      visible: true
    }
  },
  watch: {
    modelValue(newVal) {
      if (!newVal) {
        this.snapAndDisappear();
      } else {
        this.visible = true;
      }
    }
  },
  methods: {
    async snapAndDisappear() {
      const $el = this.$refs.container;
      const $canvas = await html2canvas($el, { backgroundColor: null });
      const $container = document.createElement('div');
      $container.classList.add('disintegration-container');


      const frames = generateFrames($canvas, 64);
      frames.forEach((f, i) => {
        f.style.position = 'absolute';
        f.style.top = '0';
        f.style.left = '0';
        f.style.transition = `transform ${this.duration}ms ease-out, opacity ${this.duration}ms ease-out`;
        f.style.transitionDelay = `${(1.2 * i) / frames.length}s`;
        f.style.opacity = '1';
        f.style.transform = 'translate(0, 0)';
        $container.appendChild(f);
      });


      replaceElementVisually($el, $container);
      $container.offsetLeft;


      frames.forEach((f) => {
        const angle = 2 * Math.PI * (Math.random() - 0.5);
        const dx = 60 * Math.cos(angle);
        const dy = 30 * Math.sin(angle);
        const rot = 15 * (Math.random() - 0.5);
        f.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        f.style.opacity = '0';
      });


      setTimeout(() => {
        this.visible = false;
        this.$emit('update:modelValue', false);
        $container.remove();
      }, this.duration + 300);
    }
  }
}
</script>


<style scoped>
.disintegration-container {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}
</style>