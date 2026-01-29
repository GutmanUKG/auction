<template>
  <AdminLayout>
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏘️</div>
          <div class="stat-content">
            <h3>Всего лотов</h3>
            <p class="stat-number">{{ totalLots }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Активных лотов</h3>
            <p class="stat-number">{{ activeLots }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Новых за неделю</h3>
            <p class="stat-number">{{ newLotsThisWeek }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Участников торгов</h3>
            <p class="stat-number">{{ totalParticipants }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading">Загрузка статистики...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout.vue'
import axios from '@/axios'

export default {
  name: 'AdminDashboard',
  components: { AdminLayout },
  data() {
    return {
      totalLots: 0,
      activeLots: 0,
      newLotsThisWeek: 0,
      totalParticipants: 0,
      loading: false,
      error: null
    }
  },
  mounted() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('/admin/stats')

        if (response.data) {
          this.totalLots = response.data.totalLots || 0
          this.activeLots = response.data.activeLots || 0
          this.newLotsThisWeek = response.data.newLotsThisWeek || 0
          this.totalParticipants = response.data.totalParticipants || 0
        }
      } catch (error) {
        console.error('Error loading stats:', error)
        this.error = 'Не удалось загрузить статистику'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 48px;
}

.stat-content h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin-top: 20px;
}

.loading {
  background: #e8f5e9;
  color: #2e7d32;
}

.error {
  background: #ffebee;
  color: #c62828;
}
</style>
