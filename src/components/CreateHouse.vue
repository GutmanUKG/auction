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

          <div class="form-group">
            <label for="auctionEndDate">Дата и время окончания аукциона *</label>
            <input
              type="datetime-local"
              id="auctionEndDate"
              v-model="formData.auctionEndDate"
              required
            >
            <small class="form-hint">Обязательное поле. Укажите дату и время окончания торгов.</small>
          </div>
        </div>

        <div class="form-section">
          <h2>Изображения</h2>

          <div class="form-group">
            <label for="mainImage">Главное изображение</label>
            <div class="image-upload-wrapper">
              <div v-if="formData.mainImage" class="current-image">
                <img :src="getImgUrl(formData.mainImage)" alt="Preview" class="preview-image">
                <button type="button" @click="removeMainImage" class="btn-remove-img">×</button>
              </div>
              <div class="upload-controls">
                <input
                  type="file"
                  id="mainImageFile"
                  ref="mainImageInput"
                  @change="handleMainImageUpload"
                  accept="image/*"
                  class="file-input"
                >
                <label for="mainImageFile" class="btn-upload">
                  📁 Выбрать файл
                </label>
                <span v-if="uploadingMain" class="uploading">Загрузка...</span>
              </div>
              <input
                type="text"
                id="mainImage"
                v-model="formData.mainImage"
                placeholder="или укажите название файла"
                class="filename-input"
              >
            </div>
            <small class="form-hint">Загрузите изображение с устройства или укажите название существующего файла</small>
          </div>

          <div class="form-group">
            <label>Дополнительные изображения</label>
            <div class="upload-controls">
              <input
                type="file"
                id="additionalImageFile"
                ref="additionalImageInput"
                @change="handleAdditionalImageUpload"
                accept="image/*"
                class="file-input"
              >
              <label for="additionalImageFile" class="btn-upload">
                📁 Добавить изображение
              </label>
              <span v-if="uploadingAdditional" class="uploading">Загрузка...</span>
            </div>
            <small class="form-hint">Загрузите дополнительные изображения для галереи</small>

            <div v-if="formData.images.length > 0" class="images-gallery">
              <div v-for="(image, index) in formData.images" :key="index" class="gallery-item">
                <img :src="getImgUrl(image)" :alt="`Image ${index + 1}`" class="gallery-image">
                <button type="button" @click="removeImage(index)" class="btn-remove-gallery">×</button>
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
        auctionEndDate: '',
        mainImage: '',
        images: []
      },
      isSubmitting: false,
      error: null,
      success: false,
      uploadingMain: false,
      uploadingAdditional: false
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
    async handleMainImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.uploadingMain = true

      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post('/upload/image', formData)

        if (response.data.success) {
          this.formData.mainImage = response.data.filename
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        this.error = 'Ошибка при загрузке изображения: ' + (error.response?.data?.message || error.message)
      } finally {
        this.uploadingMain = false
      }
    },
    removeMainImage() {
      this.formData.mainImage = ''
      if (this.$refs.mainImageInput) {
        this.$refs.mainImageInput.value = ''
      }
    },
    async handleAdditionalImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.uploadingAdditional = true

      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post('/upload/image', formData)

        if (response.data.success) {
          this.formData.images.push(response.data.filename)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        this.error = 'Ошибка при загрузке изображения: ' + (error.response?.data?.message || error.message)
      } finally {
        this.uploadingAdditional = false
        if (this.$refs.additionalImageInput) {
          this.$refs.additionalImageInput.value = ''
        }
      }
    },
    removeImage(index) {
      this.formData.images.splice(index, 1)
    },
    getImgUrl(filename) {
      if (!filename) return ''
      if (filename.startsWith('http')) return filename
      return `http://localhost:3000/uploads/${filename}`
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

.image-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.current-image {
  position: relative;
  display: inline-block;
  max-width: 300px;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.btn-remove-img {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: #e55300;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.btn-remove-img:hover {
  background: #cc4700;
}

.upload-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-input {
  display: none;
}

.btn-upload {
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
  display: inline-block;
}

.btn-upload:hover {
  background: #0066cc;
}

.uploading {
  color: #0077E6;
  font-size: 14px;
  font-style: italic;
}

.filename-input {
  margin-top: 10px;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: transform 0.3s;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-gallery {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: #e55300;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  opacity: 0.9;
}

.btn-remove-gallery:hover {
  background: #cc4700;
  opacity: 1;
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
