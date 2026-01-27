<template>
  <div class="create-house-container">
    <div class="container">
      <h1 class="page-title">Создать новый лот</h1>

      <!-- Сообщение для неавторизованных пользователей -->
      <div v-if="!isAuthenticated" class="auth-warning">
        <h3>Требуется авторизация</h3>
        <p>Для создания лота необходимо войти в систему.</p>
        <button @click="$router.push('/')" class="btn btn-primary">Перейти на главную</button>
      </div>

      <form v-else @submit.prevent="createHouse" class="create-house-form">
        <div class="form-section">
          <h2>Основная информация</h2>

          <div class="form-group">
            <label for="name">Название объекта *</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              required
              placeholder="Например: Красивый дом на берегу озера"
            >
          </div>

          <div class="form-group">
            <label for="prevText">Краткое описание *</label>
            <textarea
              id="prevText"
              v-model="formData.prevText"
              required
              rows="2"
              placeholder="Краткое описание объекта (1-2 предложения)"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="text">Полное описание *</label>
            <textarea
              id="text"
              v-model="formData.text"
              required
              rows="5"
              placeholder="Подробное описание объекта"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="startPrice">Начальная цена (₸) *</label>
            <input
              type="number"
              id="startPrice"
              v-model.number="formData.startPrice"
              required
              min="0"
              placeholder="5000000"
            >
          </div>
        </div>

        <div class="form-section">
          <h2>Адрес</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="country">Страна *</label>
              <input
                type="text"
                id="country"
                v-model="formData.country"
                required
                placeholder="Казахстан"
              >
            </div>

            <div class="form-group">
              <label for="city">Город *</label>
              <input
                type="text"
                id="city"
                v-model="formData.city"
                required
                placeholder="Алматы"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="street">Улица</label>
              <input
                type="text"
                id="street"
                v-model="formData.street"
                placeholder="ул. Абая"
              >
            </div>

            <div class="form-group">
              <label for="address">Адрес</label>
              <input
                type="text"
                id="address"
                v-model="formData.address"
                placeholder="д. 123, кв. 45"
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Характеристики</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="area">Площадь (м²) *</label>
              <input
                type="number"
                id="area"
                v-model.number="formData.area"
                required
                min="1"
                placeholder="100"
              >
            </div>

            <div class="form-group">
              <label for="countRoom">Количество комнат *</label>
              <input
                type="number"
                id="countRoom"
                v-model.number="formData.countRoom"
                required
                min="1"
                placeholder="3"
              >
            </div>

            <div class="form-group">
              <label for="year">Год постройки</label>
              <input
                type="number"
                id="year"
                v-model.number="formData.year"
                min="1900"
                :max="currentYear"
                placeholder="2020"
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Дата аукциона</h2>

          <div class="form-group">
            <label for="auctionStartDate">Дата и время начала аукциона</label>
            <input
              type="datetime-local"
              id="auctionStartDate"
              v-model="formData.auctionStartDate"
            >
          </div>
        </div>

        <div class="form-section">
          <h2>Изображения</h2>

          <div class="form-group">
            <label for="mainImage">Главное изображение</label>
            <input
              type="text"
              id="mainImage"
              v-model="formData.mainImage"
              placeholder="house-main.jpg"
            >
            <small class="form-hint">Укажите название файла изображения</small>
          </div>

          <div class="form-group">
            <label>Дополнительные изображения</label>
            <div class="images-input">
              <input
                type="text"
                v-model="newImage"
                @keyup.enter="addImage"
                placeholder="house-1.jpg"
              >
              <button type="button" @click="addImage" class="btn-add-image">Добавить</button>
            </div>
            <small class="form-hint">Нажмите Enter или кнопку "Добавить" для добавления изображения</small>

            <div v-if="formData.images.length > 0" class="images-list">
              <div v-for="(image, index) in formData.images" :key="index" class="image-item">
                <span>{{ image }}</span>
                <button type="button" @click="removeImage(index)" class="btn-remove">×</button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.go(-1)" class="btn btn-secondary">Отмена</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Создание...' : 'Создать лот' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Лот успешно создан! Перенаправление...
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'CreateHouse',
  data() {
    return {
      formData: {
        name: '',
        prevText: '',
        text: '',
        startPrice: null,
        country: 'Казахстан',
        city: '',
        street: '',
        address: '',
        area: null,
        countRoom: null,
        year: null,
        auctionStartDate: '',
        mainImage: '',
        images: []
      },
      newImage: '',
      isSubmitting: false,
      error: null,
      success: false
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    isAuthenticated() {
      // Проверяем наличие токена в localStorage или Vuex store
      const token = localStorage.getItem('token');
      return !!token;
    }
  },
  methods: {
    addImage() {
      if (this.newImage.trim()) {
        this.formData.images.push(this.newImage.trim());
        this.newImage = '';
      }
    },
    removeImage(index) {
      this.formData.images.splice(index, 1);
    },
    async createHouse() {
      this.isSubmitting = true;
      this.error = null;
      this.success = false;

      try {
        // Формируем данные для отправки
        const data = {
          ...this.formData,
          year: this.formData.year || null,
          street: this.formData.street || null,
          address: this.formData.address || null,
          auctionStartDate: this.formData.auctionStartDate || null
        };

        const response = await axios.post('/houses', data);

        this.success = true;
        console.log('Лот создан:', response.data);

        // Перенаправляем на главную страницу через 2 секунды
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);

      } catch (err) {
        console.error('Ошибка при создании лота:', err);

        // Более детальная обработка ошибок
        if (err.response) {
          if (err.response.status === 401) {
            this.error = 'Вы не авторизованы. Пожалуйста, войдите в систему.';
          } else if (err.response.status === 403) {
            this.error = 'У вас нет прав для создания лотов.';
          } else {
            this.error = err.response.data?.message || 'Ошибка при создании лота.';
          }
        } else if (err.request) {
          this.error = 'Ошибка соединения с сервером. Проверьте подключение к интернету.';
        } else {
          this.error = 'Произошла непредвиденная ошибка.';
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.create-house-container {
  min-height: calc(100vh - 100px);
  padding: 40px 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 40px;
  text-align: center;
}

.create-house-form {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e0e0e0;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333333;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  background: white;
  border-color: #0077E6;
  box-shadow: 0 0 0 3px rgba(0, 119, 230, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.form-hint {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.6);
  margin-top: 6px;
}

.images-input {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-add-image {
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: #0077E6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
}

.btn-add-image:hover {
  background: #0066cc;
}

.images-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333333;
}

.btn-remove {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #e55300;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-remove:hover {
  background: rgba(229, 83, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 14px 32px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 64px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  color: white;
  background: #0077E6;
}

.btn-primary:hover:not(:disabled) {
  background: #0066cc;
  box-shadow: 0 4px 12px rgba(0, 119, 230, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  color: #333333;
  background: #e0e0e0;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.error-message {
  margin-top: 24px;
  padding: 16px 20px;
  background: rgba(229, 83, 0, 0.1);
  border-left: 4px solid #e55300;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #e55300;
}

.success-message {
  margin-top: 24px;
  padding: 16px 20px;
  background: rgba(0, 187, 97, 0.1);
  border-left: 4px solid #00bd62;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #00bd62;
}

.auth-warning {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.auth-warning h3 {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
}

.auth-warning p {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.75);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .create-house-form {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
