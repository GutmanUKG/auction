# Миграция проекта с MongoDB на MySQL

## Выполненные изменения

### Backend

1. **Создана структура для миграций и seeds**
   - `backend/migrations/` - папка с миграциями базы данных
   - `backend/seeds/` - папка с начальными данными

2. **Созданы миграции**
   - `20260127000000_create_users_table.cjs` - создание таблицы пользователей
   - `20260127000001_create_houses_table.cjs` - создание таблицы объектов недвижимости

3. **Создана модель для работы с MySQL**
   - `backend/models/houseModel.js` - модель для работы с таблицей houses через Knex

4. **Переписан контроллер**
   - `backend/controllers/HouseController.js` - переписан для работы с MySQL вместо MongoDB
   - Добавлены новые методы: `getItem`, `updateItem`, `deleteItem`, `placeBid`

5. **Созданы роуты**
   - `backend/routes/houses.js` - роуты для работы с объектами недвижимости
   - GET `/houses` - получить все объекты
   - GET `/houses/:id` - получить один объект по ID
   - POST `/houses` - создать новый объект (требует авторизации)
   - PUT `/houses/:id` - обновить объект (требует авторизации)
   - DELETE `/houses/:id` - удалить объект (требует авторизации)
   - POST `/houses/:id/bid` - сделать ставку (требует авторизации)

6. **Обновлен главный файл сервера**
   - `backend/index.js` - добавлено подключение роутов houses

7. **Созданы seed файлы с тестовыми данными**
   - `backend/seeds/01_users.cjs` - 3 тестовых пользователя
   - `backend/seeds/02_houses.cjs` - 10 объектов недвижимости

### Frontend

1. **Обновлен Vuex store**
   - `src/store/index.js` - изменен URL с `/lots` на `/houses`

2. **Обновлены компоненты**
   - `src/components/house_items/house_item_vue.vue` - изменено `data._id` на `data.id`

## Структура таблиц

### Таблица users
- `id` - уникальный идентификатор (BIGINT UNSIGNED AUTO_INCREMENT)
- `full_name` - полное имя (VARCHAR 255)
- `email` - email (VARCHAR 255, уникальный)
- `phone` - телефон (VARCHAR 32, уникальный)
- `password_hash` - хеш пароля (VARCHAR 255)
- `avatar_url` - URL аватара (VARCHAR 512)
- `role` - роль пользователя (ENUM: user, admin)
- `created_at` - дата создания (DATETIME)
- `updated_at` - дата обновления (DATETIME)

### Таблица houses
- `id` - уникальный идентификатор (BIGINT UNSIGNED AUTO_INCREMENT)
- `name` - название (VARCHAR 255)
- `prev_text` - краткое описание (TEXT)
- `text` - полное описание (TEXT)
- `start_price` - начальная цена (DECIMAL 15,2)
- `current_price` - текущая цена (DECIMAL 15,2)
- `finish_price` - финальная цена (DECIMAL 15,2)
- `winner_user` - победители (JSON)
- `images` - изображения (JSON)
- `main_image` - главное изображение (VARCHAR 512)
- `country` - страна (VARCHAR 100)
- `city` - город (VARCHAR 100)
- `area` - площадь (INT)
- `count_room` - количество комнат (INT)
- `views_count` - счетчик просмотров (INT)
- `user_count` - счетчик участников (INT)
- `user_id` - ID пользователя (BIGINT UNSIGNED, FOREIGN KEY)
- `created_at` - дата создания (DATETIME)
- `updated_at` - дата обновления (DATETIME)

## Тестовые данные

### Пользователи
1. **Администратор**
   - Email: admin@mail.ru
   - Пароль: password123
   - Роль: admin

2. **Иван Иванов**
   - Email: ivan@mail.ru
   - Пароль: password123
   - Роль: user

3. **Мария Петрова**
   - Email: maria@mail.ru
   - Пароль: password123
   - Роль: user

### Объекты недвижимости
Создано 10 объектов недвижимости с различными характеристиками в городах:
- Алматы
- Нур-Султан
- Шымкент
- Караганда
- Алматинская область

## Запуск проекта

### 1. Убедитесь, что MySQL сервер запущен
```bash
# Проверьте, что MySQL работает через XAMPP Control Panel
```

### 2. Настройте переменные окружения
Убедитесь, что в файле `backend/.env` правильно указаны параметры подключения к БД:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=auction_db
JWT_SECRET=supersecret
BCRYPT_ROUNDS=10
```

### 3. Установите зависимости (если еще не установлены)
```bash
cd backend
npm install
```

### 4. Запустите миграции (уже выполнено)
```bash
cd backend
npx knex migrate:latest --knexfile knexfile.cjs
```

### 5. Заполните БД тестовыми данными (уже выполнено)
```bash
cd backend
npx knex seed:run --knexfile knexfile.cjs
```

### 6. Запустите backend сервер
```bash
cd backend
npm run dev
# или
npm start
```

### 7. Запустите frontend приложение
```bash
npm run serve
```

## Проверка работы

### Проверка API
Вы можете протестировать API используя curl или Postman:

```bash
# Получить все объекты
curl http://localhost:3000/houses

# Получить один объект
curl http://localhost:3000/houses/1

# Авторизация
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.ru","password":"password123"}'
```

### Проверка БД
```bash
cd backend
node test_db.js
```

## Важные замечания

1. **Mongoose больше не используется** - все старые модели MongoDB (`backend/models/User.js`, `backend/models/houseItems.js`) больше не используются, но оставлены для справки.

2. **Старый контроллер UserController.js** использует Mongoose и больше не работает. Используется новый `authController.js`.

3. **API endpoints изменены**:
   - Старый: `/lots`
   - Новый: `/houses`

4. **ID объектов**: В MongoDB использовался `_id`, в MySQL используется `id`.

5. **Типы данных**: JSON поля (images, winnerUser) автоматически сериализуются/десериализуются в модели.

## Дальнейшие шаги

1. Удалить старые файлы MongoDB если они больше не нужны:
   - `backend/models/User.js`
   - `backend/models/houseItems.js`
   - `backend/controllers/UserController.js`

2. Обновить остальные Vue компоненты, если они используют MongoDB специфичные поля.

3. Добавить обработку загрузки и хранения изображений.

4. Настроить production окружение с правильными переменными окружения.

5. Добавить валидацию для роутов houses (если требуется).
