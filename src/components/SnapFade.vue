<template>
  <div ref="wrapper" class="snap-wrapper">
    <div v-if="visible" ref="content">
      <slot />
    </div>
    <canvas v-show="isSnapping" ref="canvas" class="snap-canvas"></canvas>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import html2canvas from 'html2canvas';

export default {
  name: 'SnapFade',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const wrapper = ref(null);
    const content = ref(null);
    const canvas = ref(null);
    const isSnapping = ref(false);

    watch(() => props.visible, async (newVal) => {
      if (!newVal) {
        await nextTick();
        snapAndDust();
      }
    });

    async function snapAndDust() {
      const el = content.value;
      const cvs = canvas.value;

      if (!el || !cvs) return;

      const screenshot = await html2canvas(el, {backgroundColor: null});

      cvs.width = screenshot.width;
      cvs.height = screenshot.height;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(screenshot, 0, 0);

      isSnapping.value = true;

      const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      const particles = [];

      for (let y = 0; y < imageData.height; y += 4) {
        for (let x = 0; x < imageData.width; x += 4) {
          const i = (y * imageData.width + x) * 4;
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          if (a > 0) {
            particles.push({
              x, y,
              dx: (Math.random() - 0.5) * 8,
              dy: (Math.random() - 0.5) * 8 - 2,
              alpha: 1,
              color: `rgba(${r},${g},${b},${a / 255})`
            });
          }
        }
      }

      let frame = 0;

      function animate() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        particles.forEach(p => {
          p.x += p.dx;
          p.y += p.dy;
          p.alpha -= 0.015;

          if (p.alpha > 0) {
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/g, `${p.alpha})`);
            ctx.fillRect(p.x, p.y, 2, 2);
          }
        });

        frame++;
        if (frame < 100) {
          requestAnimationFrame(animate);
        } else {
          isSnapping.value = false;
        }
      }

      animate();
    }

    return {
      wrapper,
      content,
      canvas,
      isSnapping
    };
  }
};
</script>

<style scoped>
.snap-wrapper {
  position: relative;
}

.snap-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
