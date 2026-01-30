<template>
  <AdminLayout>
    <div class="admin-users">
      <div class="users-header">
        <h1>Управление пользователями</h1>
      </div>

      <div v-if="loading" class="loading">Загрузка пользователей...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && users.length > 0" class="users-table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Количество лотов</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="user in paginatedUsers" :key="user.id">
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone || '—' }}</td>
                <td>
                  <span :class="['role-badge', user.role]">
                    {{ user.role === 'admin' ? 'Админ' : 'Пользователь' }}
                  </span>
                </td>
                <td class="lots-count">{{ user.lotsCount || 0 }}</td>
                <td class="actions">
                  <button
                    @click="toggleUserLots(user.id)"
                    class="btn-view"
                    title="Посмотреть лоты"
                    v-if="user.lotsCount > 0"
                  >
                    👁️
                  </button>
                </td>
              </tr>
              <!-- Раскрывающаяся строка с лотами пользователя -->
              <tr v-if="expandedUserId === user.id" class="lots-row">
                <td colspan="7">
                  <div class="user-lots">
                    <h3>Лоты пользователя {{ user.fullName }}:</h3>
                    <table class="lots-table">
                      <thead>
                        <tr>
                          <th>ID лота</th>
                          <th>Название</th>
                          <th>Ставка</th>
                          <th>Дата участия</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="lot in user.participatedLots" :key="lot.id">
                          <td>{{ lot.id }}</td>
                          <td>{{ lot.name }}</td>
                          <td class="bid-amount">{{ formatPrice(lot.bid_amount) }}</td>
                          <td>{{ formatDate(lot.participated_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && users.length > 0" class="pagination">
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

      <div v-if="!loading && users.length === 0" class="empty-state">
        <p>Пользователей пока нет.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { formatNumber } from '@/utils/helpers'
import axios from '@/axios'

export default {
  name: 'AdminUsers',
  components: { AdminLayout },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 20,
      expandedUserId: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.users.slice(start, end)
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    formatPrice(price) {
      return formatNumber(price, '₸')
    },
    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${day}.${month}.${year} ${hours}:${minutes}`
    },
    toggleUserLots(userId) {
      if (this.expandedUserId === userId) {
        this.expandedUserId = null
      } else {
        this.expandedUserId = userId
      }
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
    async loadUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('/admin/users')
        this.users = response.data.users || []
      } catch (error) {
        console.error('Error loading users:', error)
        this.error = 'Не удалось загрузить пользователей'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-users {
  max-width: 1400px;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.users-header h1 {
  margin: 0;
  color: #2c3e50;
}

.users-table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #34495e;
  color: white;
}

.users-table th {
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table tbody tr:not(.lots-row) {
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.2s;
}

.users-table tbody tr:not(.lots-row):hover {
  background: #f8f9fa;
}

.users-table td {
  padding: 15px 12px;
  font-size: 14px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #ffeaa7;
  color: #d63031;
}

.role-badge.user {
  background: #dfe6e9;
  color: #2d3436;
}

.lots-count {
  font-weight: 600;
  color: #3498db;
  text-align: center;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-view {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
  background: #3498db;
}

.btn-view:hover {
  transform: scale(1.1);
}

.lots-row {
  background: #f8f9fa;
}

.lots-row td {
  padding: 20px;
}

.user-lots {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.user-lots h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
}

.lots-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.lots-table thead {
  background: #ecf0f1;
}

.lots-table thead th {
  padding: 10px;
  text-align: left;
  font-size: 13px;
  color: #2c3e50;
}

.lots-table tbody tr {
  border-bottom: 1px solid #ecf0f1;
}

.lots-table tbody td {
  padding: 10px;
  font-size: 13px;
}

.bid-amount {
  font-weight: 600;
  color: #27ae60;
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
