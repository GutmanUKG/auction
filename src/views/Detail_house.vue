<template>
  <div class="detail-page" v-if="detailHouse && detailHouse.id">
    <div class="container">
      <div class="detail-content">
        <!-- Левая колонка: Галерея изображений -->
        <div class="detail-gallery">
          <h1 class="detail-title">{{ detailHouse.name }}</h1>

          <!-- Галерея изображений -->
          <template v-if="images.length > 0">
            <swiper
              class="detail-swiper"
              :slides-per-view="1"
              :space-between="10"
              :pagination="{ clickable: true }"
              :navigation="true"
            >
              <swiper-slide v-for="(image, idx) in images" :key="idx">
                <img :src="getImgUrl(image)" :alt="detailHouse.name" class="gallery-image">
              </swiper-slide>
            </swiper>
          </template>
          <template v-else>
            <div class="no-image">
              <img :src="noImg" alt="Нет изображения" class="gallery-image">
            </div>
          </template>

          <!-- Описание -->
          <div class="detail-description">
            <h2>Описание</h2>
            <p class="preview-text" v-if="detailHouse.prevText">{{ detailHouse.prevText }}</p>
            <p class="full-text" v-if="detailHouse.text">{{ detailHouse.text }}</p>
          </div>
        </div>

        <!-- Правая колонка: Информация и торги -->
        <div class="detail-sidebar">
          <!-- Карточка информации -->
          <div class="info-card">
            <h2>Информация о лоте</h2>

            <!-- Адрес -->
            <div class="info-item">
              <span class="info-label">Город:</span>
              <span class="info-value">{{ detailHouse.city }}</span>
            </div>
            <div class="info-item" v-if="detailHouse.street">
              <span class="info-label">Улица:</span>
              <span class="info-value">{{ detailHouse.street }}</span>
            </div>
            <div class="info-item" v-if="detailHouse.address">
              <span class="info-label">Адрес:</span>
              <span class="info-value">{{ detailHouse.address }}</span>
            </div>

            <!-- Характеристики -->
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">Площадь:</span>
              <span class="info-value">{{ detailHouse.area }} м²</span>
            </div>
            <div class="info-item">
              <span class="info-label">Комнат:</span>
              <span class="info-value">{{ detailHouse.countRoom }}</span>
            </div>
            <div class="info-item" v-if="detailHouse.year">
              <span class="info-label">Год постройки:</span>
              <span class="info-value">{{ detailHouse.year }}</span>
            </div>

            <!-- Статистика -->
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">Просмотров:</span>
              <span class="info-value">{{ detailHouse.viewsCount || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Участников торгов:</span>
              <span class="info-value">{{ activePeople }}</span>
            </div>
          </div>

          <!-- Карточка торгов -->
          <div class="auction-card">
            <h2>Торги</h2>

            <div class="price-info">
              <div class="price-row">
                <span class="price-label">Стартовая цена:</span>
                <span class="price-value">{{ formatNumber(detailHouse.startPrice) }} ₸</span>
              </div>
              <div class="price-row current-price-row">
                <span class="price-label">Текущая цена:</span>
                <span class="price-value current-price">{{ formatNumber(currentPrice) }} ₸</span>
              </div>
            </div>

            <!-- Форма для ставки -->
            <div class="bid-form" v-if="isAuthenticated">
              <div v-if="!isShowInput">
                <button @click="showBidInput" class="btn-bid">Сделать ставку</button>
              </div>

              <div v-else class="bid-input-container">
                <input
                  v-model.number="bidAmount"
                  type="number"
                  :min="currentPrice + 1"
                  placeholder="Введите сумму"
                  class="bid-input"
                  @keyup.enter="placeBid"
                >
                <div class="bid-actions">
                  <button @click="placeBid" class="btn-submit">Подтвердить</button>
                  <button @click="cancelBid" class="btn-cancel">Отмена</button>
                </div>
              </div>

              <!-- Уведомления -->
              <div v-if="isWin" class="notification success">
                Вы лидируете в торгах!
              </div>
              <div v-if="isShowLose" class="notification warning">
                {{ isLoseText }}
              </div>
            </div>
            <div v-else class="auth-required">
              <p>Для участия в торгах необходимо авторизоваться</p>
              <button @click="$router.push('/')" class="btn-auth">Войти</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Загрузка...</p>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import noImg from '@/assets/no-img.jpg';
import { mapState, mapGetters } from 'vuex';
import { getImgUrl, formatNumber } from '@/utils/helpers';

export default {
  name: "DetailHouse",
  props: ['id'],

  data() {
    return {
      noImg,
      images: [],
      currentPrice: 0,
      activePeople: 0,
      bidAmount: null,
      isShowInput: false,
      isWin: false,
      isShowLose: false,
      isLoseText: 'Вас перебили!',
    };
  },

  components: {
    Swiper,
    SwiperSlide,
  },

  computed: {
    ...mapState(['detailHouse', 'isLoading']),
    ...mapGetters(['isAuthenticated']),
  },

  watch: {
    'detailHouse.images': {
      handler(newVal) {
        if (newVal && Array.isArray(newVal)) {
          this.images = newVal;
        }
      },
      immediate: true
    },
    'detailHouse.currentPrice': {
      handler(newVal) {
        if (newVal) {
          this.currentPrice = newVal;
        } else if (this.detailHouse.startPrice) {
          this.currentPrice = this.detailHouse.startPrice;
        }
      },
      immediate: true
    },
    'detailHouse.userCount': {
      handler(newVal) {
        if (newVal !== undefined) {
          this.activePeople = newVal;
        }
      },
      immediate: true
    }
  },

  methods: {
    getImgUrl,
    formatNumber,

    showBidInput() {
      this.isShowInput = true;
      this.isShowLose = false;
      this.bidAmount = this.currentPrice + 1;
    },

    cancelBid() {
      this.isShowInput = false;
      this.bidAmount = null;
    },

    async placeBid() {
      if (!this.bidAmount || this.bidAmount <= this.currentPrice) {
        alert('Ставка должна быть выше текущей цены');
        return;
      }

      this.isShowInput = false;

      // Отправляем ставку через Socket.IO
      const bidData = {
        id: this.detailHouse.id,
        price: this.bidAmount,
      };

      this.$socket.emit('updatePrice', bidData);
      this.isWin = true;
      this.currentPrice = this.bidAmount;
    },
  },

  created() {
    // Загружаем данные лота
    this.$store.dispatch('getHouseItemById', this.id);
  },

  mounted() {
    // Подписываемся на обновления через Socket.IO
    this.$socket.on('counterUpdated', (response) => {
      if (this.detailHouse.id === response.id) {
        this.activePeople = response.counter;
      }
    });

    this.$socket.on('PriceUpdated', (response) => {
      if (this.detailHouse.id === response.id) {
        this.currentPrice = response.price;
        this.isWin = false;
        this.isShowLose = response.isShowLose || true;
        this.isLoseText = response.isLoseText || 'Вас перебили!';
      }
    });
  },

  beforeUnmount() {
    // Отписываемся от событий Socket.IO при уничтожении компонента
    this.$socket.off('counterUpdated');
    this.$socket.off('PriceUpdated');
  }
};
</script>

<style scoped>
.detail-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

/* Левая колонка: Галерея */
.detail-gallery {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.detail-swiper {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.no-image {
  margin-bottom: 30px;
}

.detail-description {
  margin-top: 30px;
}

.detail-description h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.preview-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.full-text {
  font-size: 15px;
  color: #555;
  line-height: 1.8;
}

/* Правая колонка: Сайдбар */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.auction-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h2,
.auction-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.info-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 15px 0;
}

/* Торги */
.price-info {
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.current-price-row {
  background: #f0f7ff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

.price-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.price-value {
  font-size: 16px;
  color: #333;
  font-weight: 700;
}

.current-price {
  color: #2196f3;
  font-size: 20px;
}

/* Форма ставки */
.bid-form {
  margin-top: 20px;
}

.btn-bid {
  width: 100%;
  padding: 15px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-bid:hover {
  background: #1976d2;
}

.bid-input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bid-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.bid-input:focus {
  border-color: #2196f3;
}

.bid-actions {
  display: flex;
  gap: 10px;
}

.btn-submit {
  flex: 1;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #45a049;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #da190b;
}

/* Уведомления */
.notification {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.notification.success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.notification.warning {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ff9800;
}

/* Требуется авторизация */
.auth-required {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.auth-required p {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.btn-auth {
  padding: 12px 30px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-auth:hover {
  background: #1976d2;
}

/* Загрузка */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  font-size: 18px;
  color: #666;
}

/* Адаптивность */
@media (max-width: 992px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .detail-title {
    font-size: 24px;
  }

  .gallery-image {
    height: 300px;
  }

  .detail-gallery,
  .info-card,
  .auction-card {
    padding: 20px;
  }
}
</style>
