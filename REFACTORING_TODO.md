# Техническое задание: Рефакторинг проекта (Продолжение)

## Статус выполнения: 3 из 7 фаз завершено ✅

Дата последнего обновления: 2026-01-28

---

## ✅ Выполненные фазы (1-3)

### ФАЗА 1: Удаление мертвого кода (Backend) ✅
**Статус:** Завершено
**Коммит:** `eb97daa` - refactor(backend): remove unused Mongoose models and controllers

**Что сделано:**
- ✅ Удалено 23 файла (~2000 строк кода)
- ✅ Удалены устаревшие контроллеры: `UserController.js`, `controllers/index.js`
- ✅ Удалены устаревшие модели Mongoose: `User.js`, `houseItems.js`
- ✅ Удалены устаревшие валидации: `auth.js`, `addItem.js`
- ✅ Удалены устаревшие утилиты: `checkAuth.js`, `handleValidationErrors.js`
- ✅ Удалены тестовые файлы: `test_auth_flow.js`, `test_create_house.js`, `test_db.js`, `check_table.js`, `check_new_fields.js`, `drop_tables.js`
- ✅ Удалена временная документация: 5 .md файлов

**Проверка:** Backend запускается, `/health` endpoint работает

---

### ФАЗА 2: Исправление критических багов ✅
**Статус:** Завершено
**Коммит:** `eb97daa` (включен в фазу 1)

**Что исправлено:**
1. ✅ **adminAuth middleware** (`backend/middleware/adminAuth.js`)
   - Заменен `throw new HttpError` на `return res.status(403).json({...})`
   - Исправлена обработка ошибок в обычной функции

2. ✅ **Логический баг в фильтре** (`src/components/fillter_vue.vue:164`)
   - Было: `this.paramsFilter.checkObj.isNewHouse`
   - Стало: `this.paramsFilter.checkObj.isBuildHouse`

3. ✅ **Добавлена отсутствующая мутация** (`src/store/index.js`)
   - Добавлена мутация `updateParamsFilter(state, params)`
   - Исправлена ошибка, которая возникала при очистке фильтров

---

### ФАЗА 3: Создание общих утилит ✅
**Статус:** Завершено
**Коммит:** `38e34bf` - refactor(utils): create shared helpers

**Что создано:**
- ✅ Файл `src/utils/helpers.js` с функциями:
  - `formatNumber(num, suffix)` - форматирование чисел с разделителями
  - `getImgUrl(pic, placeholder)` - получение URL изображений с обработкой ошибок

**Обновленные компоненты:**
- ✅ `src/components/selector_vue.vue`
- ✅ `src/components/house_items/house_item_vue.vue`
- ✅ `src/views/Admin/AdminPanel.vue`
- ✅ `src/views/Admin/AdminLots.vue`
- ✅ `src/views/Admin/DashboardPanel.vue`

**Результат:** Устранено дублирование кода (~50 строк)

---

## 📋 Оставшиеся фазы (4-7)

### ФАЗА 4: Создание AdminLayout компонента 📐

**Цель:** Устранить дублирование layout кода в 3 админ-компонентах

#### Шаг 4.1: Создать компонент AdminLayout
**Создать файл:** `src/layouts/AdminLayout.vue`

**Структура компонента:**
```vue
<template>
  <div class="row admin-layout">
    <div class="col-2 items-list">
      <a href="/" class="logo">
        <picture>
          <img :src="getImgUrl('logo.svg')" alt="">
        </picture>
      </a>
      <ul class="menu-list">
        <li>
          <router-link to="/admin">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/dashboard">User Profile</router-link>
        </li>
        <li>
          <router-link to="/adminLots">Lots</router-link>
        </li>
      </ul>
    </div>
    <div class="col-10 admin-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { getImgUrl } from '@/utils/helpers'

export default {
  name: 'AdminLayout',
  methods: {
    getImgUrl
  }
}
</script>

<style lang="scss" scoped>
/* Перенести общие стили из админ-панелей */
.admin-layout {
  /* ... стили ... */
}

.menu-list {
  /* ... стили меню ... */
}
</style>
```

#### Шаг 4.2: Обновить админ-компоненты

**Файлы для изменения:**
1. `src/views/Admin/AdminPanel.vue`
2. `src/views/Admin/DashboardPanel.vue`
3. `src/views/Admin/AdminLots.vue`

**Что делать:**
- Импортировать AdminLayout
- Обернуть содержимое в `<AdminLayout>`
- Удалить дублирующийся код боковой навигации
- Удалить дублирующиеся стили

**Пример:**
```vue
<template>
  <AdminLayout>
    <!-- Только уникальный контент страницы -->
    <div>
      Контент админ-панели
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout.vue'

export default {
  components: { AdminLayout }
}
</script>
```

**Проверка:**
- [ ] Все 3 админ-страницы загружаются
- [ ] Навигация между страницами работает
- [ ] Стили применяются корректно

**Коммит:**
```bash
git commit -m "feat(layouts): create AdminLayout component

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### ФАЗА 5: Переименование компонентов ⚠️ КРИТИЧЕСКАЯ

**⚠️ ВНИМАНИЕ:** Это самая критическая фаза! Создайте резервную копию перед началом.

**Подготовка:**
```bash
git add .
git commit -m "Before component renaming"
git branch backup-before-rename
```

#### Список переименований (13 компонентов)

**Группа 1: Компоненты без зависимостей** (выполнять первыми)

1. **banner_vue.vue → BannerVue.vue**
   - Файл: `src/components/banner_vue.vue` → `src/components/BannerVue.vue`
   - Обновить `name` в компоненте: `name: 'BannerVue'`
   - Обновить импорт в: `src/views/HomeView.vue`
   - Изменить: `import BannerVue from "@/components/BannerVue"`
   - Обновить использование: `<BannerVue></BannerVue>`

2. **city_list.vue → CityList.vue**
   - Файл: `src/components/city_list.vue` → `src/components/CityList.vue`
   - Обновить `name`: `name: 'CityList'`
   - Обновить импорт в: `src/components/fillter_vue.vue`

3. **check_filter_vue.vue → CheckFilterVue.vue**
   - Файл: `src/components/check_filter_vue.vue` → `src/components/CheckFilterVue.vue`
   - Обновить `name`: `name: 'CheckFilterVue'`
   - Обновить импорт в: `src/components/fillter_vue.vue`

4. **selector_vue.vue → SelectorVue.vue**
   - Файл: `src/components/selector_vue.vue` → `src/components/SelectorVue.vue`
   - Обновить `name`: `name: 'SelectorVue'`
   - Обновить импорт в: `src/components/fillter_vue.vue`

5. **Thanos_transition.vue → ThanosTransition.vue**
   - Файл: `src/components/Thanos_transition.vue` → `src/components/ThanosTransition.vue`
   - Обновить `name`: `name: 'ThanosTransition'`

**Проверка после группы 1:**
```bash
npm run serve
# Проверить главную страницу, фильтры
```

**Группа 2: Компоненты с зависимостями уровня 1**

6. **login_user.vue → LoginUser.vue**
   - Файл: `src/components/login_user.vue` → `src/components/LoginUser.vue`
   - Обновить `name`: `name: 'LoginUser'`
   - Обновить импорт в: `src/components/auth_vue.vue`

7. **register_user.vue → RegisterUser.vue**
   - Файл: `src/components/register_user.vue` → `src/components/RegisterUser.vue`
   - Обновить `name`: `name: 'RegisterUser'`
   - Обновить импорт в: `src/components/auth_vue.vue`

8. **auth_vue.vue → AuthVue.vue**
   - Файл: `src/components/auth_vue.vue` → `src/components/AuthVue.vue`
   - Обновить `name`: `name: 'AuthVue'`
   - Обновить импорт в: `src/components/header_vue.vue`

9. **fillter_vue.vue → FilterVue.vue** ⚠️ **ИСПРАВИТЬ ОПЕЧАТКУ!**
   - Файл: `src/components/fillter_vue.vue` → `src/components/FilterVue.vue`
   - Обновить `name`: `name: 'FilterVue'`
   - Обновить импорт в: `src/views/HomeView.vue`

**Проверка после группы 2:**
```bash
npm run serve
# Проверить авторизацию, фильтры
```

**Группа 3: Компоненты house_items**

10. **house_item_vue.vue → HouseItemVue.vue**
    - Файл: `src/components/house_items/house_item_vue.vue` → `src/components/house_items/HouseItemVue.vue`
    - Обновить `name`: `name: 'HouseItemVue'`
    - Обновить импорт в: `src/components/house_items/house_items_list_vue.vue`

11. **house_items_list_vue.vue → HouseItemsListVue.vue**
    - Файл: `src/components/house_items/house_items_list_vue.vue` → `src/components/house_items/HouseItemsListVue.vue`
    - Обновить `name`: `name: 'HouseItemsListVue'`
    - Обновить импорт в: `src/views/HomeView.vue`

**Группа 4: Компоненты верхнего уровня**

12. **header_vue.vue → HeaderVue.vue**
    - Файл: `src/components/header_vue.vue` → `src/components/HeaderVue.vue`
    - Обновить `name`: `name: 'HeaderVue'`
    - Обновить импорт в: `src/App.vue`

**Группа 5: Views**

13. **Detail_house.vue → DetailHouse.vue**
    - Файл: `src/views/Detail_house.vue` → `src/views/DetailHouse.vue`
    - Обновить `name`: `name: 'DetailHouse'`
    - Обновить импорт в: `src/router/index.js`

#### Удалить неиспользуемые компоненты

**Файлы для удаления:**
```bash
rm src/components/HelloWorld.vue
rm src/components/SnapFade.vue
# Проверить использование AboutView.vue, если не используется:
rm src/views/AboutView.vue
# И удалить соответствующий роут из router/index.js
```

**Проверка после ВСЕХ переименований:**
- [ ] Главная страница загружается
- [ ] Фильтры работают
- [ ] Карточки домов отображаются
- [ ] Детальная страница работает
- [ ] Авторизация работает
- [ ] Админ-панель работает
- [ ] Нет ошибок в консоли браузера

**Коммиты:**
```bash
git commit -m "refactor(components): rename to PascalCase - Groups 1-2

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git commit -m "refactor(components): rename to PascalCase - Groups 3-5

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git commit -m "refactor: remove unused components

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### ФАЗА 6: Очистка кода 🧹

#### Шаг 6.1: Удалить закомментированный код

**Файлы для редактирования:**

1. **src/router/index.js** (строки 30-35)
   ```javascript
   // Удалить:
   // {
   //   path: '/admin/users',
   //   name: 'AdminUsers',
   //   component: () => import('../views/Admin/AdminUsers'),
   //   meta: { requiresAuth: true, requiresAdmin: true }
   // },
   ```

2. **src/components/AuthVue.vue** (после переименования)
   - Строка 55: `//import ThanosTransition from "@/components/Thanos_transition.vue";`
   - Строка 111: `//ThanosTransition,`

3. **src/store/index.js**
   - Строка 2: `// import {response} from "express";`

#### Шаг 6.2: Удалить неиспользуемые элементы store

**Файл:** `src/store/index.js`

**Удалить mutations:**
- `UPDATE_VISIBLE_ITEMS` (строки 43-45)
- `PUSH_DETAIL_PAGE` (строки 50-52)

**Удалить actions:**
- `updateVisibleItems` (строки 110-116)
- `loadItems` - **⚠️ ПРОВЕРИТЬ ИСПОЛЬЗОВАНИЕ ПЕРЕД УДАЛЕНИЕМ**
  ```bash
  # Поиск использования:
  grep -rn "loadItems" src/
  ```

**Удалить getters:**
- `hasMoreItems` (строки 23-25)

#### Шаг 6.3: Удалить console.log()

**Найти все console.log:**
```bash
grep -rn "console.log" src/ --exclude-dir=node_modules
grep -rn "console.log" backend/ --exclude-dir=node_modules
```

**Файлы для очистки:**

**Frontend:**
- `src/store/index.js` (строки 86, 101, 114, 118, 139)
- `src/components/fillter_vue.vue` (строка 146)
- `src/components/house_items/house_item_vue.vue` (строки 179, 215, 262)
- `src/components/login_user.vue` (строки 41, 47)
- `src/components/auth_vue.vue` (строки 71, 74, 102)
- `src/views/HomeView.vue` (строка 22)

**Backend:**
- `backend/controllers/authController.js` (строка 21)
- **⚠️ НЕ УДАЛЯТЬ:** `backend/index.js` - логирование Socket.IO (информационное)

**Замена console.log:**
- Для отладки: полностью удалить
- Для информационных сообщений backend: оставить или заменить на logger

#### Шаг 6.4: Удалить неиспользуемую функцию

**Файл:** `backend/models/houseModel.js`

**Найти и удалить:**
```javascript
export async function incrementUserCount(id) {
  // ... код функции ...
}
```

**⚠️ ПРОВЕРКА ПЕРЕД УДАЛЕНИЕМ:**
```bash
grep -rn "incrementUserCount" backend/
```

**Проверка после фазы 6:**
- [ ] Приложение работает без console.log
- [ ] Нет ошибок в консоли
- [ ] Backend запускается
- [ ] Frontend собирается: `npm run build`

**Коммиты:**
```bash
git commit -m "refactor: remove commented code and unused store items

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git commit -m "refactor: remove console.log statements

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### ФАЗА 7: Обновление зависимостей 📦

#### Шаг 7.1: Обновить Frontend package.json

**Файл:** `package.json`

**Удалить/Исправить зависимости:**
```json
{
  "dependencies": {
    // УДАЛИТЬ (опечатка):
    "nodeman": "^1.1.2",

    // УДАЛИТЬ (дублирование, оставить vue3-slick-carousel):
    "vue-slick": "^1.2.0",

    // УДАЛИТЬ (не нужен во frontend):
    "mysql": "^2.18.1"
  }
}
```

**Оставить:**
- `vue3-slick-carousel` ✅
- `socket.io-client` ✅

#### Шаг 7.2: Обновить Backend package.json

**Файл:** `backend/package.json`

**Удалить зависимости:**
```json
{
  "dependencies": {
    // УДАЛИТЬ (мигрировано на Knex):
    "mongoose": "^7.3.4",

    // УДАЛИТЬ (мигрировано на Zod):
    "express-validator": "^7.0.1"
  }
}
```

#### Шаг 7.3: Установить зависимости

**Команды:**
```bash
# Frontend
cd c:\xampp\htdocs\auc
npm install

# Backend
cd backend
npm install
```

**Проверка:**
```bash
# Проверить сборку frontend
npm run build

# Проверить запуск frontend
npm run serve

# Проверить запуск backend
cd backend
npm start
```

**Финальная проверка:**
- [ ] `npm run build` - проект собирается
- [ ] `npm run serve` - frontend стартует
- [ ] `cd backend && npm start` - backend стартует
- [ ] Нет ошибок зависимостей
- [ ] Размер bundle не увеличился значительно

**Коммит:**
```bash
git commit -m "chore: update dependencies and fix package.json

- Removed mongoose (migrated to Knex)
- Removed express-validator (migrated to Zod)
- Removed vue-slick (using vue3-slick-carousel)
- Fixed nodeman typo

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🎯 Финальный чеклист

После завершения всех фаз:

### Frontend ✅
- [ ] Главная страница загружается
- [ ] Фильтры работают корректно (исправлен баг isBuildHouse)
- [ ] Список домов отображается
- [ ] Изображения отображаются (getImgUrl работает)
- [ ] Цены форматируются с пробелами (formatNumber работает)
- [ ] Детальная страница дома работает
- [ ] Авторизация работает
- [ ] Админ-панель доступна для админов
- [ ] Все 3 админ-страницы используют общий AdminLayout
- [ ] Нет ошибок в консоли браузера
- [ ] Сборка проходит: `npm run build`

### Backend ✅
- [ ] Сервер запускается: `npm start`
- [ ] `/health` endpoint отвечает
- [ ] Авторизация работает (login/register)
- [ ] Middleware adminAuth работает корректно (без throw ошибки)
- [ ] API домов работает
- [ ] Socket.IO работает
- [ ] Нет неиспользуемых файлов

### Общее ✅
- [ ] Git статус чистый
- [ ] Производительность не ухудшилась
- [ ] Размер bundle не увеличился

---

## 📊 Метрики успеха

### Что будет удалено:
- **Backend:** ~15 файлов, 2 зависимости (mongoose, express-validator)
- **Frontend:** 2-3 компонента, ~15 console.log, 3 зависимости
- **Документация:** 5 временных .md файлов

### Что будет переименовано:
- **13 компонентов** приведены к стандарту PascalCase

### Что будет исправлено:
- **3 критических бага** (adminAuth ✅, isBuildHouse ✅, updateParamsFilter ✅)

### Что будет улучшено:
- Устранено дублирование кода (~50 строк) ✅
- Создан общий layout для админ-панелей
- Соответствие Vue.js Best Practices
- Улучшена поддерживаемость кода

---

## ⚠️ Критические моменты

### Высокий риск: Фаза 5 (переименование)
- **Риск:** Пропуск импорта может сломать приложение
- **Митигация:**
  - Создать резервную ветку ОБЯЗАТЕЛЬНО
  - Переименовывать поэтапно (по группам)
  - Тестировать после каждой группы
  - Использовать grep для проверки всех импортов

### Средний риск: Изменение store (Фаза 6)
- **Риск:** Нарушение state management
- **Митигация:** Искать использование через grep перед удалением

### Низкий риск: Фазы 4, 7
- **Риск:** Минимальный
- **Митигация:** Стандартное тестирование

---

## 📝 Порядок выполнения

**Рекомендуемый график:**

- **День 1:** Фаза 4 (AdminLayout) - 2-3 часа
- **День 2-3:** Фаза 5 (Переименование) - 4-6 часов ⚠️
- **День 4:** Фаза 6 (Очистка кода) - 2-3 часа
- **День 5:** Фаза 7 (Зависимости) - 1-2 часа

**Общее время:** 9-14 часов работы

---

## 🔗 Полезные ссылки

- **План рефакторинга:** `C:\Users\пк\.claude\plans\tranquil-wandering-simon.md`
- **Полный транскрипт:** `C:\Users\пк\.claude\projects\c--xampp-htdocs-auc\0256a771-f681-4d0a-af80-0fa5c8e2529e.jsonl`

---

## 💡 Команды для быстрого старта

```bash
# Проверить текущий статус
git status
git log --oneline -5

# Начать фазу 4
# 1. Создать src/layouts/AdminLayout.vue
# 2. Обновить 3 админ-компонента

# Начать фазу 5 (СОЗДАТЬ РЕЗЕРВНУЮ КОПИЮ!)
git add .
git commit -m "Before component renaming"
git branch backup-before-rename

# Поиск использования компонента перед переименованием
grep -rn "banner_vue" src/

# Тестирование
npm run serve
cd backend && npm start
```

---

**Дата создания:** 2026-01-28
**Версия:** 1.0
**Автор:** Code Review Process
**Статус:** Готово к продолжению с Фазы 4
