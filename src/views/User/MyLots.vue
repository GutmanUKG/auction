<template>
  <div class="my-lots-page">
    <div class="container">
      <h1 class="page-title">Мои лоты</h1>

      <!-- Табы навигации -->
      <ul class="nav nav-tabs my-lots-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'participating' }"
            @click="activeTab = 'participating'"
            type="button"
          >
            Участвую
            <span v-if="participatingLots.length > 0" class="badge">{{ participatingLots.length }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'won' }"
            @click="activeTab = 'won'"
            type="button"
          >
            Выиграл
            <span v-if="wonLots.length > 0" class="badge badge-success">{{ wonLots.length }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'lost' }"
            @click="activeTab = 'lost'"
            type="button"
          >
            Проиграл
            <span v-if="lostLots.length > 0" class="badge badge-danger">{{ lostLots.length }}</span>
          </button>
        </li>
      </ul>

      <!-- Контент табов -->
      <div class="tab-content">
        <!-- Таб "Участвую" -->
        <div v-if="activeTab === 'participating'" class="tab-pane active">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>

          <div v-else-if="participatingLots.length === 0" class="empty-state">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="#E0E0E0" stroke-width="2"/>
              <path d="M35 50L45 60L65 40" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <h3>Вы пока не участвуете в торгах</h3>
            <p>Найдите интересный лот на главной странице и сделайте ставку</p>
            <router-link to="/" class="btn btn-primary">Перейти к лотам</router-link>
          </div>

          <div v-else class="lots-grid">
            <div v-for="lot in participatingLots" :key="lot.id" class="lot-card">
              <router-link :to="`/lot/${lot.id}`" class="lot-image">
                <img :src="getImgUrl(lot.mainImage)" :alt="lot.name" />
              </router-link>

              <div class="lot-content">
                <router-link :to="`/lot/${lot.id}`" class="lot-title">
                  {{ lot.name }}
                </router-link>

                <div class="lot-location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.79 1 4 2.79 4 5C4 8.5 8 15 8 15C8 15 12 8.5 12 5C12 2.79 10.21 1 8 1Z" stroke="#666" stroke-width="1.5"/>
                    <circle cx="8" cy="5" r="1.5" fill="#666"/>
                  </svg>
                  {{ lot.city }}
                </div>

                <div class="lot-prices">
                  <div class="price-item">
                    <span class="price-label">Текущая цена:</span>
                    <span class="price-value current">{{ formatNumber(lot.currentPrice) }} ₸</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Моя ставка:</span>
                    <span class="price-value my-bid">{{ formatNumber(lot.myLastBid) }} ₸</span>
                  </div>
                </div>

                <!-- Статус -->
                <div class="lot-status">
                  <div v-if="lot.isWinning" class="status-badge winning">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Вы лидируете!
                  </div>
                  <div v-else class="status-badge outbid">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
                      <path d="M8 5V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
                    </svg>
                    Вас перебили
                  </div>
                </div>

                <!-- Таймер -->
                <AuctionTimer
                  v-if="lot.auctionStartDate && lot.auctionEndDate"
                  :auctionStartDate="lot.auctionStartDate"
                  :auctionEndDate="lot.auctionEndDate"
                  class="lot-timer"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Таб "Выиграл" -->
        <div v-if="activeTab === 'won'" class="tab-pane active">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>

          <div v-else-if="wonLots.length === 0" class="empty-state">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path d="M50 10L55 35H80L60 50L65 75L50 60L35 75L40 50L20 35H45L50 10Z" stroke="#FFD700" stroke-width="2" fill="none"/>
            </svg>
            <h3>У вас пока нет выигранных лотов</h3>
            <p>Участвуйте в торгах и выигрывайте!</p>
          </div>

          <div v-else class="lots-grid">
            <div v-for="lot in wonLots" :key="lot.id" class="lot-card won">
              <div class="won-badge">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="#FFD700"/>
                </svg>
                Победа
              </div>

              <router-link :to="`/lot/${lot.id}`" class="lot-image">
                <img :src="getImgUrl(lot.mainImage)" :alt="lot.name" />
              </router-link>

              <div class="lot-content">
                <router-link :to="`/lot/${lot.id}`" class="lot-title">
                  {{ lot.name }}
                </router-link>

                <div class="lot-location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.79 1 4 2.79 4 5C4 8.5 8 15 8 15C8 15 12 8.5 12 5C12 2.79 10.21 1 8 1Z" stroke="#666" stroke-width="1.5"/>
                    <circle cx="8" cy="5" r="1.5" fill="#666"/>
                  </svg>
                  {{ lot.city }}
                </div>

                <div class="lot-prices">
                  <div class="price-item">
                    <span class="price-label">Финальная цена:</span>
                    <span class="price-value final">{{ formatNumber(lot.finalPrice) }} ₸</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Моя ставка:</span>
                    <span class="price-value my-bid">{{ formatNumber(lot.myLastBid) }} ₸</span>
                  </div>
                </div>

                <div class="won-date">
                  Выиграно: {{ formatDate(lot.wonDate) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Таб "Проиграл" -->
        <div v-if="activeTab === 'lost'" class="tab-pane active">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>

          <div v-else-if="lostLots.length === 0" class="empty-state">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="#E0E0E0" stroke-width="2"/>
              <path d="M35 35L65 65M65 35L35 65" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>У вас пока нет проигранных лотов</h3>
            <p>Это хорошая новость!</p>
          </div>

          <div v-else class="lots-grid">
            <div v-for="lot in lostLots" :key="lot.id" class="lot-card lost">
              <router-link :to="`/lot/${lot.id}`" class="lot-image">
                <img :src="getImgUrl(lot.mainImage)" :alt="lot.name" />
              </router-link>

              <div class="lot-content">
                <router-link :to="`/lot/${lot.id}`" class="lot-title">
                  {{ lot.name }}
                </router-link>

                <div class="lot-location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.79 1 4 2.79 4 5C4 8.5 8 15 8 15C8 15 12 8.5 12 5C12 2.79 10.21 1 8 1Z" stroke="#666" stroke-width="1.5"/>
                    <circle cx="8" cy="5" r="1.5" fill="#666"/>
                  </svg>
                  {{ lot.city }}
                </div>

                <div class="lot-prices">
                  <div class="price-item">
                    <span class="price-label">Финальная цена:</span>
                    <span class="price-value final">{{ formatNumber(lot.finalPrice) }} ₸</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Моя ставка:</span>
                    <span class="price-value my-bid">{{ formatNumber(lot.myLastBid) }} ₸</span>
                  </div>
                </div>

                <div class="winner-info" v-if="lot.winnerUsername">
                  Победитель: {{ lot.winnerUsername }}
                </div>

                <div class="lost-date">
                  Проиграно: {{ formatDate(lot.lostDate) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import { getImgUrl, formatNumber } from '@/utils/helpers';
import AuctionTimer from '@/components/AuctionTimer.vue';

export default {
  name: 'MyLots',
  components: {
    AuctionTimer
  },
  data() {
    return {
      activeTab: 'participating',
      participatingLots: [],
      wonLots: [],
      lostLots: [],
      isLoading: false
    };
  },
  methods: {
    getImgUrl,
    formatNumber,

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },

    async loadParticipatingLots() {
      try {
        this.isLoading = true;
        const response = await axios.get('/users/my-lots/participating');
        this.participatingLots = response.data;
      } catch (error) {
        console.error('Error loading participating lots:', error);
        if (error.response?.status === 401) {
          this.$router.push('/');
        }
      } finally {
        this.isLoading = false;
      }
    },

    async loadWonLots() {
      try {
        this.isLoading = true;
        const response = await axios.get('/users/my-lots/won');
        this.wonLots = response.data;
      } catch (error) {
        console.error('Error loading won lots:', error);
        if (error.response?.status === 401) {
          this.$router.push('/');
        }
      } finally {
        this.isLoading = false;
      }
    },

    async loadLostLots() {
      try {
        this.isLoading = true;
        const response = await axios.get('/users/my-lots/lost');
        this.lostLots = response.data;
      } catch (error) {
        console.error('Error loading lost lots:', error);
        if (error.response?.status === 401) {
          this.$router.push('/');
        }
      } finally {
        this.isLoading = false;
      }
    },

    async loadCurrentTab() {
      switch (this.activeTab) {
        case 'participating':
          await this.loadParticipatingLots();
          break;
        case 'won':
          await this.loadWonLots();
          break;
        case 'lost':
          await this.loadLostLots();
          break;
      }
    }
  },
  watch: {
    activeTab() {
      this.loadCurrentTab();
    }
  },
  mounted() {
    // Проверка авторизации
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/');
      return;
    }

    // Загрузить данные для первого таба
    this.loadCurrentTab();
  }
};
</script>

<style lang="scss" scoped>
.my-lots-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
}

.my-lots-tabs {
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 30px;

  .nav-item {
    margin-right: 10px;
  }

  .nav-link {
    border: none;
    background: transparent;
    padding: 12px 24px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #666;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      color: #0077E6;
      background: rgba(0, 119, 230, 0.05);
    }

    &.active {
      color: #0077E6;
      border-bottom-color: #0077E6;
    }

    .badge {
      background: #0077E6;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 600;

      &.badge-success {
        background: #00BD62;
      }

      &.badge-danger {
        background: #E55300;
      }
    }
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;

  .spinner-border {
    width: 3rem;
    height: 3rem;
    color: #0077E6;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;

  svg {
    margin-bottom: 24px;
    opacity: 0.5;
  }

  h3 {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 24px;
    color: #333;
    margin-bottom: 12px;
  }

  p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
  }

  .btn {
    padding: 12px 32px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }
}

.lots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.lot-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &.won {
    border: 2px solid #FFD700;
  }

  &.lost {
    opacity: 0.85;
  }
}

.won-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FFD700;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.lot-image {
  display: block;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.lot-content {
  padding: 16px;
}

.lot-title {
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #0077E6;
  }
}

.lot-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.lot-prices {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0;
  margin-bottom: 12px;

  .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .price-label {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #666;
  }

  .price-value {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 16px;

    &.current {
      color: #0077E6;
    }

    &.my-bid {
      color: #666;
    }

    &.final {
      color: #333;
    }
  }
}

.lot-status {
  margin-bottom: 12px;

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 13px;

    &.winning {
      background: rgba(0, 187, 97, 0.15);
      color: #00BD62;
    }

    &.outbid {
      background: rgba(229, 83, 0, 0.15);
      color: #E55300;
    }
  }
}

.lot-timer {
  margin-top: 12px;
}

.won-date,
.lost-date {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}

.winner-info {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .lots-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .my-lots-tabs .nav-link {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
