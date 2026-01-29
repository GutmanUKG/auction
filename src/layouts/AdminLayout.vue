<template>
  <div class="admin-wrapper">
    <aside class="admin-sidebar">
      <!-- Logo -->
      <div class="admin-logo">
        <router-link to="/">
          <img :src="getImgUrl('logo.svg')" alt="Logo">
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="admin-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          📊 Dashboard
        </router-link>
        <router-link to="/admin/lots" class="nav-item">
          🏘️ Управление лотами
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="admin-footer">
        <button @click="logout" class="btn-logout">Выйти</button>
      </div>
    </aside>

    <main class="admin-content">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import { getImgUrl } from '@/utils/helpers'

export default {
  name: 'AdminLayout',
  methods: {
    getImgUrl,
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.admin-logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-logo img {
  max-width: 120px;
  height: auto;
}

.admin-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: block;
  padding: 15px 25px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
  font-size: 16px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background: #3498db;
  border-left: 4px solid #2980b9;
}

.admin-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 100%;
  padding: 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  padding: 30px;
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
