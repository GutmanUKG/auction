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
            <label for="prevText">Краткое описание</label>
            <textarea
              id="prevText"
              v-model="formData.prevText"
              rows="2"
              placeholder="Краткое описание объекта (1-2 предложения)"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="text">Полное описание</label>
            <textarea
              id="text"
              v-model="formData.text"
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

          <div class="form-group">
            <label for="propertyType">Тип недвижимости</label>
            <select
              id="propertyType"
              v-model="formData.propertyType"
              class="form-control"
            >
              <option value="">Не выбрано</option>
              <option value="Квартира">Квартира</option>
              <option value="Дом">Дом</option>
              <option value="Коттедж">Коттедж</option>
              <option value="Таунхаус">Таунхаус</option>
              <option value="Коммерческая">Коммерческая недвижимость</option>
              <option value="Земельный участок">Земельный участок</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.isNewBuilding"
              >
              <span>Новостройка</span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.isUnderConstruction"
              >
              <span>В строящихся домах</span>
            </label>
          </div>
        </div>

        <!-- Изображения -->
        <div class="form-section">
          <h2>Изображения</h2>

          <div class="form-group">
            <label for="mainImage">Главное изображение</label>
            <div class="image-upload-wrapper">
              <div v-if="formData.mainImage" class="current-image">
                <img :src="getImgUrl(formData.mainImage)" alt="Current image" class="preview-image">
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
            <small class="form-hint">Загрузите новое изображение или укажите название существующего файла</small>
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

            <div v-if="formData.images && formData.images.length > 0" class="images-gallery">
              <div v-for="(image, index) in formData.images" :key="index" class="gallery-item">
                <img :src="getImgUrl(image)" :alt="`Image ${index + 1}`" class="gallery-image">
                <button type="button" @click="removeAdditionalImage(index)" class="btn-remove-gallery">×</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Даты аукциона -->
        <div class="form-section">
          <h2>Даты аукциона</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="auctionStartDate">Дата и время начала аукциона</label>
              <input
                type="datetime-local"
                id="auctionStartDate"
                v-model="localAuctionStartDate"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="auctionEndDate">Дата и время окончания аукциона *</label>
              <input
                type="datetime-local"
                id="auctionEndDate"
                v-model="localAuctionEndDate"
                class="form-control"
                required
              >
            </div>
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
import axios from '@/axios'

export default {
  name: 'EditLot',
  components: { AdminLayout },
  data() {
    return {
      lotId: this.$route.params.id,
      formData: {
        name: '',
        prevText: '',
        text: '',
        startPrice: 0,
        country: 'Казахстан',
        city: '',
        street: '',
        address: '',
        area: 0,
        countRoom: 0,
        year: null,
        propertyType: '',
        isNewBuilding: false,
        isUnderConstruction: false,
        mainImage: '',
        images: [],
        isActive: true
      },
      loading: false,
      loadError: null,
      isSaving: false,
      saveError: null,
      localAuctionStartDate: '',
      localAuctionEndDate: '',
      saveSuccess: false,
      uploadingMain: false,
      uploadingAdditional: false
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
        const response = await axios.get(`/houses/${this.lotId}`)

        if (response.data) {
          // Map database fields to form fields
          const lot = response.data
          this.formData = {
            name: lot.name || '',
            prevText: lot.prevText || '',
            text: lot.text || '',
            startPrice: lot.startPrice || 0,
            country: lot.country || 'Казахстан',
            city: lot.city || '',
            street: lot.street || '',
            address: lot.address || '',
            area: lot.area || 0,
            countRoom: lot.countRoom || 0,
            year: lot.year || null,
            propertyType: lot.propertyType || '',
            isNewBuilding: lot.isNewBuilding || false,
            isUnderConstruction: lot.isUnderConstruction || false,
            mainImage: lot.mainImage || '',
            images: lot.images || [],
            isActive: lot.isActive !== undefined ? lot.isActive : true
          }

          // Даты аукциона
          if (lot.auctionStartDate) {
            this.localAuctionStartDate = this.formatDateForInput(lot.auctionStartDate)
          }
          if (lot.auctionEndDate) {
            this.localAuctionEndDate = this.formatDateForInput(lot.auctionEndDate)
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
        const updateData = {
          ...this.formData,
          auctionStartDate: this.localAuctionStartDate ? new Date(this.localAuctionStartDate).toISOString() : null,
          auctionEndDate: this.localAuctionEndDate ? new Date(this.localAuctionEndDate).toISOString() : null
        }

        await axios.put(`/houses/${this.lotId}`, updateData)

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

        const response = await axios.post('/upload/image', formData)

        if (response.data.success) {
          this.formData.mainImage = response.data.filename
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Ошибка при загрузке изображения: ' + (error.response?.data?.message || error.message))
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
          if (!this.formData.images) {
            this.formData.images = []
          }
          this.formData.images.push(response.data.filename)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Ошибка при загрузке изображения: ' + (error.response?.data?.message || error.message))
      } finally {
        this.uploadingAdditional = false
        if (this.$refs.additionalImageInput) {
          this.$refs.additionalImageInput.value = ''
        }
      }
    },
    removeAdditionalImage(index) {
      this.formData.images.splice(index, 1)
    },
    getImgUrl(filename) {
      if (!filename) return ''
      if (filename.startsWith('http')) return filename
      return `http://localhost:3000/uploads/${filename}`
    },
    formatDateForInput(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
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

.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  cursor: pointer;
  background-color: white;
}

.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.checkbox-group {
  display: flex;
  align-items: center;
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

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #dfe6e9;
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
  background: #e74c3c;
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
  background: #c0392b;
  opacity: 1;
}
</style>
