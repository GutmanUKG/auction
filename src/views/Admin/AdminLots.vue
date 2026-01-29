<template>
  <AdminLayout>
    <div class="admin-lots">
      <div class="lots-header">
        <h1>Управление лотами</h1>
        <router-link to="/create-house" class="btn-add">
          ➕ Добавить лот
        </router-link>
      </div>

      <div v-if="loading" class="loading">Загрузка лотов...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && lots.length > 0" class="lots-table-wrapper">
        <table class="lots-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Фото</th>
              <th>Название</th>
              <th>Город</th>
              <th>Цена</th>
              <th>Комнаты</th>
              <th>Площадь</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lot in paginatedLots" :key="lot.id">
              <td>{{ lot.id }}</td>
              <td>
                <img
                  v-if="lot.mainImage"
                  :src="getImgUrl(lot.mainImage)"
                  alt="Preview"
                  class="lot-preview"
                >
                <span v-else class="no-image">Нет фото</span>
              </td>
              <td>{{ lot.name }}</td>
              <td>{{ lot.city }}</td>
              <td class="price">{{ formatPrice(lot.startPrice) }}</td>
              <td>{{ lot.countRoom }}</td>
              <td>{{ lot.area }} м²</td>
              <td>
                <span :class="['status-badge', isLotActive(lot) ? 'active' : 'inactive']">
                  {{ isLotActive(lot) ? 'Активен' : 'Неактивен' }}
                </span>
              </td>
              <td class="actions">
                <button @click="editLot(lot.id)" class="btn-edit" title="Редактировать">
                  ✏️
                </button>
                <button @click="deleteLot(lot.id)" class="btn-delete" title="Удалить">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && lots.length > 0" class="pagination">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          ← Предыдущая
        </button>
        <span class="pagination-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Следующая →
        </button>
      </div>

      <div v-if="!loading && lots.length === 0" class="empty-state">
        <p>Лотов пока нет. Добавьте первый лот!</p>
        <router-link to="/create-house" class="btn-add">
          Добавить лот
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { formatNumber, getImgUrl } from '@/utils/helpers'
import axios from 'axios'

export default {
  name: 'AdminLots',
  components: { AdminLayout },
  data() {
    return {
      lots: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 20
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.lots.length / this.itemsPerPage)
    },
    paginatedLots() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.lots.slice(start, end)
    }
  },
  mounted() {
    this.loadLots()
  },
  methods: {
    getImgUrl,
    formatPrice(price) {
      return formatNumber(price, '₸')
    },
    isLotActive(lot) {
      // Лот считается активным, если он был создан менее 30 дней назад
      // или если есть текущая цена (были ставки)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const createdAt = new Date(lot.createdAt)
      return lot.currentPrice || createdAt > thirtyDaysAgo
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    async loadLots() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('/api/houses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.lots = response.data || []
      } catch (error) {
        console.error('Error loading lots:', error)
        this.error = 'Не удалось загрузить лоты'
      } finally {
        this.loading = false
      }
    },
    editLot(id) {
      this.$router.push(`/admin/lots/${id}/edit`)
    },
    async deleteLot(id) {
      if (!confirm('Вы уверены, что хотите удалить этот лот?')) {
        return
      }

      try {
        await axios.delete(`/api/houses/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        // Remove from local array
        this.lots = this.lots.filter(lot => lot.id !== id)

        alert('Лот успешно удален')
      } catch (error) {
        console.error('Error deleting lot:', error)
        alert('Не удалось удалить лот: ' + (error.response?.data?.message || error.message))
      }
    }
  }
}
</script>

<style scoped>
.admin-lots {
  max-width: 1400px;
}

.lots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.lots-header h1 {
  margin: 0;
  color: #2c3e50;
}

.btn-add {
  padding: 12px 24px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  display: inline-block;
}

.btn-add:hover {
  background: #229954;
}

.lots-table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lots-table {
  width: 100%;
  border-collapse: collapse;
}

.lots-table thead {
  background: #34495e;
  color: white;
}

.lots-table th {
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lots-table tbody tr {
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.2s;
}

.lots-table tbody tr:hover {
  background: #f8f9fa;
}

.lots-table td {
  padding: 15px 12px;
  font-size: 14px;
}

.lot-preview {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  color: #95a5a6;
  font-size: 12px;
}

.price {
  font-weight: 600;
  color: #27ae60;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.btn-edit {
  background: #3498db;
}

.btn-edit:hover {
  transform: scale(1.1);
}

.btn-delete {
  background: #e74c3c;
}

.btn-delete:hover {
  transform: scale(1.1);
}

.loading,
.error {
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #2980b9;
}

.pagination-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}
</style>
