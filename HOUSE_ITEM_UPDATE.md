# Обновление компонента house_item_vue.vue и структуры данных

## Выполненные изменения

### 1. Добавлены новые поля в базу данных

Создана миграция `20260127000002_add_missing_fields_to_houses.cjs`, которая добавляет следующие поля:

- `year` (INTEGER) - Год постройки дома
- `street` (VARCHAR 255) - Улица
- `address` (VARCHAR 255) - Адрес
- `auction_start_date` (DATETIME) - Дата и время начала аукциона

### 2. Обновлена модель houseModel.js

Обновлены функции:
- `mapRow()` - добавлен маппинг новых полей
- `create()` - добавлена поддержка новых полей при создании
- `update()` - добавлена поддержка новых полей при обновлении

Маппинг полей:
```javascript
{
  street: row.street,
  address: row.address,
  year: row.year,
  auctionStartDate: row.auction_start_date
}
```

### 3. Обновлен контроллер HouseController.js

Метод `addItem` теперь принимает новые поля:
```javascript
const {
  name,
  mainImage,
  prevText,
  text,
  startPrice,
  images,
  country,
  city,
  street,        // новое
  address,       // новое
  area,
  countRoom,
  year,          // новое
  auctionStartDate // новое
} = req.body;
```

### 4. Восстановлена верстка в house_item_vue.vue

#### Раскомментированы и исправлены:
- Полная верстка карточки лота с изображениями
- Swiper компоненты для слайдера изображений
- Все элементы интерфейса (название, адрес, цена, дата, участники)
- Кнопки действий (участвовать, сделать ставку)
- Статусы ставок (выигрывает, перебита)

#### Исправлен маппинг данных:
- `data._id` → `data.id`
- `data.slider_img` → `data.images`
- `data.current_people` → `data.userCount`
- `data.price` → `data.currentPrice || data.startPrice`
- `data.date` → `data.auctionStartDate || data.createdAt`
- `data.adress` → `data.address`
- Добавлена поддержка `data.street` и `data.year`

#### Обновлены методы компонента:
```javascript
formattedDate() {
  // Использует auctionStartDate или createdAt
  const dateField = this.data.auctionStartDate || this.data.createdAt;
  // ...
}

activePeopleDB() {
  return this.activePeople = this.data.userCount || 0
}

currentPriceDB() {
  return this.currentPrice = this.data.currentPrice || this.data.startPrice
}
```

### 5. Обновлены seed файлы

Файл `02_houses.cjs` обновлен с данными для всех 10 объектов:
- Добавлены реалистичные улицы и адреса
- Добавлены годы постройки (2018-2024)
- Добавлены даты начала аукционов (февраль 2026)

## Структура данных лота

Полная структура объекта дома:
```javascript
{
  id: 11,
  name: "Красивый дом на берегу озера",
  prevText: "Прекрасный вид на озеро",
  text: "Этот великолепный дом...",
  startPrice: 50000000,
  currentPrice: 50000000,
  finishPrice: null,
  winnerUser: [],
  images: ["house1-1.jpg", "house1-2.jpg", "house1-3.jpg"],
  mainImage: "house1-main.jpg",
  country: "Казахстан",
  city: "Алматы",
  street: "ул. Озерная",         // новое
  address: "д. 15",               // новое
  area: 250,
  countRoom: 5,
  year: 2020,                     // новое
  auctionStartDate: "2026-02-01", // новое
  viewsCount: 124,
  userCount: 15,
  userId: 1,
  createdAt: "2026-01-27...",
  updatedAt: "2026-01-27..."
}
```

## Функционал компонента

### Отображение информации:
- Слайдер изображений (если больше 1 изображения)
- Главное изображение (если 1 изображение)
- Placeholder (если нет изображений)
- Название дома с площадью и годом постройки
- Полный адрес (город, улица, адрес)
- Текущая цена (currentPrice или startPrice)
- Дата начала аукциона
- Количество участников

### Функционал ставок:
1. **Кнопка "Участвовать"** - для вступления в аукцион
2. **Кнопка "Сделать ставку"** - для участников
3. **Поле ввода ставки** - с кнопкой OK
4. **Статус "Ставка выигрывает!"** - зеленая кнопка
5. **Статус "Ставка перебита!"** - оранжевая кнопка с возможностью повысить ставку
6. **Кнопка избранного** - сердечко

### WebSocket интеграция:
- Обновление количества участников в реальном времени
- Обновление текущей цены в реальном времени
- Уведомления о перебитой ставке
- Звуковое уведомление при перебитии ставки

## Проверка работы

### Проверка БД:
```bash
cd backend
node check_new_fields.js
```

### Проверка API:
```bash
curl http://localhost:3000/houses
curl http://localhost:3000/houses/11
```

### Запуск приложения:
```bash
# Backend
cd backend
npm run dev

# Frontend
npm run serve
```

## Важные замечания

1. **Изображения**: В компоненте используется функция `getImgUrl(item)`, которая формирует путь к изображению. Убедитесь, что изображения находятся в папке `/upload/` или обновите путь в методе `getImgUrl()`.

2. **WebSocket**: Компонент использует `this.$socket` для работы с WebSocket. Убедитесь, что Socket.io правильно настроен в приложении.

3. **Роутинг**: Ссылка на детальную страницу использует роут с именем `detail_house`. Убедитесь, что такой роут существует в вашем router.

4. **Даты**: Если `auctionStartDate` не указана, используется `createdAt`. Для новых объектов рекомендуется всегда указывать `auctionStartDate`.

5. **Валюта**: Цены отображаются без указания валюты. При необходимости добавьте символ валюты в метод `formatNumber()`.
