// thanosUtils.js

const DEBUG = false;

export function generateFrames($canvas, count = 64) {
    const { width, height } = $canvas;
    const ctx = $canvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, width, height);
    const imageDatas = [...Array(count)].map(() => ctx.createImageData(width, height));

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            for (let i = 0; i < 2; ++i) {
                const dataIndex = Math.floor(count * (Math.random() + 2 * x / width) / 3);
                const pixelIndex = (y * width + x) * 4;
                for (let offset = 0; offset < 4; ++offset) {
                    imageDatas[dataIndex].data[pixelIndex + offset] = originalData.data[pixelIndex + offset];
                }
            }
        }
    }

    return imageDatas.map((data, i) => {
        const $c = $canvas.cloneNode(true);
        const cctx = $c.getContext("2d");
        cctx.putImageData(data, 0, 0);

        if (DEBUG) {
            $c.style.animation = `debug-pulse 1s ease ${1.35 * i / count}s infinite alternate`;
            $c.style.animation = `debug-pulse 1s ease ${$c.style.transitionDelay} infinite alternate`;
            $c.style.outline = '2px solid red'; // чтобы точно было видно
            $c.style.zIndex = 9999;             // убедимся, что не перекрыто
            $c.style.opacity = '1';             // обязательно!
            $c.style.transform = 'none';        // без лишних начальных смещений
        }

        return $c;
    });
}

export function replaceElementVisually($old, $new) {
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
    $old.style.visibility = 'hidden';
}