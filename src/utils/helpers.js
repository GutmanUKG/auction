/**
 * Форматирует число с разделителями тысяч
 * @param {number|string} num - Число для форматирования
 * @param {string} suffix - Суффикс (например, '₸', 'м2')
 * @returns {string} Отформатированное число
 */
export function formatNumber(num, suffix = '') {
  if (!num && num !== 0) return '';

  const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return suffix ? `${formatted} ${suffix}` : formatted;
}

/**
 * Получает URL изображения с обработкой ошибок
 * @param {string} pic - Имя файла изображения
 * @param {string} placeholder - URL placeholder изображения
 * @returns {string} URL изображения
 */
export function getImgUrl(pic, placeholder = null) {
  // Проверяем, что pic существует и не пустая строка
  if (!pic || pic.trim() === '') {
    return placeholder || require('@/assets/no-img.jpg');
  }

  // Если это уже полный URL, возвращаем как есть
  if (pic.startsWith('http://') || pic.startsWith('https://')) {
    return pic;
  }

  // Формируем URL для загрузки с бэкенда
  return `http://localhost:3000/uploads/${pic}`;
}
