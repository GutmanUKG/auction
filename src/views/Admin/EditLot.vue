<template>
  <AdminLayout>
    <div class="edit-lot">
      <div class="edit-lot-header">
        <h1>Редактирование лота #{{ lotId }}</h1>
        <button @click="goBack" class="btn-back">← Назад к списку</button>
      </div>

      <div v-if="loading" class="loading">Загрузка данных лота...</div>
      <div v-if="loadError" class="error">{{ loadError }}</div>

      <form v-if="!loading && !loadError" @submit.prevent="saveLot" class="lot-form">
        <!-- Основная информация -->
        <div class="form-section">
          <h2>Основная информация</h2>

          <div class="form-group">
            <label for="title">Название объекта *</label>
            <input
              type="text"
              id="title"
              v-model="formData.title"
              required
              placeholder="Например: Красивый дом на берегу озера"
            >
          </div>

          <div class="form-group">
            <label for="prevText">Краткое описание</label>
            <textarea
              id="prevText"
              v-model="formData.prevText"
              rows="2"
              placeholder="Краткое описание объекта (1-2 предложения)"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="description">Полное описание</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="5"
              placeholder="Подробное описание объекта"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="price">Цена (₸) *</label>
            <input
              type="number"
              id="price"
              v-model.number="formData.price"
              required
              min="0"
              placeholder="5000000"
            >
          </div>
        </div>

        <!-- Адрес -->
        <div class="form-section">
          <h2>Адрес</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="country">Страна</label>
              <input
                type="text"
                id="country"
                v-model="formData.country"
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

        <!-- Характеристики -->
        <div class="form-section">
          <h2>Характеристики</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="square">Площадь (м²) *</label>
              <input
                type="number"
                id="square"
                v-model.number="formData.square"
                required
                min="1"
                placeholder="100"
              >
            </div>

            <div class="form-group">
              <label for="rooms">Количество комнат *</label>
              <input
                type="number"
                id="rooms"
                v-model.number="formData.rooms"
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

        <!-- Изображения -->
        <div class="form-section">
          <h2>Главное изображение</h2>

          <div class="form-group">
            <label for="pic">Главное изображение</label>
            <div class="image-upload-wrapper">
              <div v-if="formData.pic" class="current-image">
                <img :src="getImgUrl(formData.pic)" alt="Current image" class="preview-image">
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
                id="pic"
                v-model="formData.pic"
                placeholder="или укажите название файла"
                class="filename-input"
              >
            </div>
            <small class="form-hint">Загрузите новое изображение или укажите название существующего файла</small>
          </div>
        </div>

        <!-- Статус -->
        <div class="form-section">
          <h2>Статус</h2>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.isActive"
              >
              <span>Лот активен</span>
            </label>
          </div>
        </div>

        <!-- Действия -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-secondary">Отмена</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            {{ isSaving ? 'Сохранение...' : '💾 Сохранить изменения' }}
          </button>
        </div>
      </form>

      <div v-if="saveError" class="error">{{ saveError }}</div>
      <div v-if="saveSuccess" class="success">Изменения успешно сохранены!</div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout.vue'
import axios from 'axios'

export default {
  name: 'EditLot',
  components: { AdminLayout },
  data() {
    return {
      lotId: this.$route.params.id,
      formData: {
        title: '',
        prevText: '',
        description: '',
        price: 0,
        country: 'Казахстан',
        city: '',
        street: '',
        address: '',
        square: 0,
        rooms: 0,
        year: null,
        pic: '',
        isActive: true
      },
      loading: false,
      loadError: null,
      isSaving: false,
      saveError: null,
      saveSuccess: false,
      uploadingMain: false
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    this.loadLot()
  },
  methods: {
    async loadLot() {
      this.loading = true
      this.loadError = null

      try {
        const response = await axios.get(`/api/houses/${this.lotId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.data) {
          // Map database fields to form fields
          const lot = response.data
          this.formData = {
            title: lot.title || '',
            prevText: lot.prevText || '',
            description: lot.description || '',
            price: lot.price || 0,
            country: lot.country || 'Казахстан',
            city: lot.city || '',
            street: lot.street || '',
            address: lot.address || '',
            square: lot.square || 0,
            rooms: lot.rooms || 0,
            year: lot.year || null,
            pic: lot.pic || '',
            isActive: lot.isActive !== undefined ? lot.isActive : true
          }
        }
      } catch (error) {
        console.error('Error loading lot:', error)
        this.loadError = 'Не удалось загрузить данные лота: ' + (error.response?.data?.message || error.message)
      } finally {
        this.loading = false
      }
    },
    async saveLot() {
      this.isSaving = true
      this.saveError = null
      this.saveSuccess = false

      try {
        await axios.put(`/api/houses/${this.lotId}`, this.formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.saveSuccess = true

        // Redirect after 1.5 seconds
        setTimeout(() => {
          this.$router.push('/admin/lots')
        }, 1500)
      } catch (error) {
        console.error('Error saving lot:', error)
        this.saveError = 'Не удалось сохранить изменения: ' + (error.response?.data?.message || error.message)
      } finally {
        this.isSaving = false
      }
    },
    goBack() {
      this.$router.push('/admin/lots')
    },
    async handleMainImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.uploadingMain = true

      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.data.success) {
          this.formData.pic = response.data.filename
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Ошибка при загрузке изображения: ' + (error.response?.data?.message || error.message))
      } finally {
        this.uploadingMain = false
      }
    },
    removeMainImage() {
      this.formData.pic = ''
      if (this.$refs.mainImageInput) {
        this.$refs.mainImageInput.value = ''
      }
    },
    getImgUrl(filename) {
      if (!filename) return ''
      if (filename.startsWith('http')) return filename
      return `http://localhost:3000/uploads/${filename}`
    }
  }
}
</script>

<style scoped>
.edit-lot {
  max-width: 1000px;
}

.edit-lot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.edit-lot-header h1 {
  margin: 0;
  color: #2c3e50;
}

.btn-back {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #7f8c8d;
}

.lot-form {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 1px solid #ecf0f1;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #34495e;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #7f8c8d;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 14px;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #dfe6e9;
}

.loading,
.error,
.success {
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin: 20px 0;
}

.loading {
  background: #e8f5e9;
  color: #2e7d32;
}

.error {
  background: #ffebee;
  color: #c62828;
}

.success {
  background: #e8f5e9;
  color: #2e7d32;
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
  border: 2px solid #dfe6e9;
}

.btn-remove-img {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: #e74c3c;
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
  background: #c0392b;
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
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  display: inline-block;
}

.btn-upload:hover {
  background: #2980b9;
}

.uploading {
  color: #3498db;
  font-size: 14px;
  font-style: italic;
}

.filename-input {
  margin-top: 10px;
}
</style>
