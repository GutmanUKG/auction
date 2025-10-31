// src/directives/v-thanos.js
import html2canvas from 'html2canvas';

const DEBUG = false; // ✅ Debug mode enabled
const REPETITION_COUNT = 2;
const NUM_FRAMES = 64;

function generateFrames($canvas, count = NUM_FRAMES) {
    const { width, height } = $canvas;
    const ctx = $canvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, width, height);
    const imageDatas = [...Array(count)].map(() => ctx.createImageData(width, height));

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            for (let i = 0; i < REPETITION_COUNT; ++i) {
                const dataIndex = Math.floor(
                    count * (Math.random() + 2 * x / width) / 3
                );
                const pixelIndex = (y * width + x) * 4;
                for (let offset = 0; offset < 4; ++offset) {
                    imageDatas[dataIndex].data[pixelIndex + offset] =
                        originalData.data[pixelIndex + offset];
                }
            }
        }
    }

    return imageDatas.map(data => {
        const $c = $canvas.cloneNode(true);
        $c.getContext("2d").putImageData(data, 0, 0);
        return $c;
    });
}

function replaceElementVisually($old, $new) {
    const rect = $old.getBoundingClientRect();
    const style = window.getComputedStyle($old);
    $new.style.position = 'absolute';
    $new.style.top = `${rect.top + window.scrollY}px`;
    $new.style.left = `${rect.left + window.scrollX}px`;
    $new.style.width = `${rect.width}px`;
    $new.style.height = `${rect.height}px`;
    $new.style.pointerEvents = 'none';
    $new.style.zIndex = style.zIndex || 9999;
    document.body.appendChild($new);
    $old.style.visibility = "hidden";
}

function disintegrate($elm) {
    html2canvas($elm).then($canvas => {
        const $container = document.createElement("div");
        $container.classList.add("disintegration-container");

        const $frames = generateFrames($canvas, NUM_FRAMES);
        $frames.forEach(($frame, i) => {
            $frame.style.position = 'absolute';
            $frame.style.top = '0';
            $frame.style.left = '0';
            $frame.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
            $frame.style.transitionDelay = `${1.35 * i / $frames.length}s`;
            $frame.style.opacity = '1';
            $frame.style.transform = 'translate(0, 0) rotate(0deg)';
            $container.appendChild($frame);
        });

        replaceElementVisually($elm, $container);

        $container.offsetLeft;

        if (!DEBUG) {
            $frames.forEach($frame => {
                const angle = 2 * Math.PI * (Math.random() - 0.5);
                const dx = 60 * Math.cos(angle);
                const dy = 30 * Math.sin(angle);
                const rotate = 15 * (Math.random() - 0.5);
                $frame.style.zIndex = 9999;
                $frame.style.opacity = '1';
                $frame.style.animation = `debug-pulse 1s ease ${$frame.style.transitionDelay} infinite alternate`;
                $frame.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
                $frame.style.opacity = '0';
            });
        } else {
            $frames.forEach($frame => {
                $frame.style.animation = `debug-pulse 1s ease ${$frame.style.transitionDelay} infinite alternate`;
                $frame.style.outline = '2px solid red'; // чтобы точно было видно
                $frame.style.zIndex = 9999;             // убедимся, что не перекрыто
                $frame.style.opacity = '1';             // обязательно!
                $frame.style.transform = 'none';        // без лишних начальных смещений

            });
        }

        setTimeout(() => {
            $container.remove();
        }, 3000);
    }).catch(err => {
        console.error('❌ html2canvas error:', err);
    });
}

export default {
    mounted(el) {
        el.addEventListener('click', () => {
            if (el.dataset.disintegrated) return;
            el.dataset.disintegrated = 'true';
            console.log('⚡️ Disintegrating:', el);
            disintegrate(el);
        });
    }
};