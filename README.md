# K-Pop Backend API

Бэкенд приложение для K-Pop на NestJS с использованием PostgreSQL.

> 📚 **Для быстрого старта**: см. [QUICKSTART.md](./QUICKSTART.md)  
> 📖 **Полная документация**: см. [DOCS_INDEX.md](./DOCS_INDEX.md)  
> 🔌 **Примеры API**: см. [API_EXAMPLES.md](./API_EXAMPLES.md)  
> 🐳 **Используете Podman?**: см. [PODMAN.md](./PODMAN.md)

## 🚀 Технологии

- **NestJS** - прогрессивный Node.js фреймворк
- **PostgreSQL** - реляционная база данных
- **TypeORM** - ORM для работы с базой данных
- **TypeScript** - типизированный JavaScript
- **Docker/Podman** - контейнеризация для удобного развертывания

## 📋 Требования

- Node.js >= 18.x
- npm или yarn
- PostgreSQL >= 12 (или Docker/Podman для запуска через compose)
- Git

## 🛠️ Установка и запуск локально

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd k-pop-backend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл с вашими настройками:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=kpop_db

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 4. Запуск базы данных

#### Вариант A: Docker
```bash
docker-compose up -d
```

#### Вариант B: Podman
```bash
podman-compose up -d
```

Это запустит PostgreSQL в контейнере на порту 5432.

> 💡 **Совет для Podman**: Создайте алиасы для удобства:
> ```bash
> alias docker='podman'
> alias docker-compose='podman-compose'
> ```
> После этого все Docker команды будут работать!

### 5. Запуск приложения в режиме разработки

```bash
npm run start:dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 🧪 Тестирование API

### Health Check

```bash
curl http://localhost:3000/health
```

### Получить список артистов

```bash
curl http://localhost:3000/artists
```

### Создать артиста

```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BTS",
    "debutDate": "2013-06-13",
    "agency": "HYBE",
    "description": "Всемирно известная K-Pop группа",
    "imageUrl": "https://example.com/bts.jpg"
  }'
```

### Получить артиста по ID

```bash
curl http://localhost:3000/artists/{id}
```

### Обновить артиста

```bash
curl -X PATCH http://localhost:3000/artists/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BTS (방탄소년단)"
  }'
```

### Удалить артиста

```bash
curl -X DELETE http://localhost:3000/artists/{id}
```

## 📦 Сборка для продакшена

### 1. Сборка проекта

```bash
npm run build
```

### 2. Настройка переменных окружения для продакшена

Создайте файл `.env` с продакшен настройками:

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-password
DB_DATABASE=kpop_db

CORS_ORIGIN=https://your-frontend-domain.com
```

⚠️ **Важно**: В продакшене не используйте `synchronize: true` в TypeORM! Это автоматически включено только для `NODE_ENV=development`.

### 3. Запуск в продакшене

```bash
npm run start:prod
```

## 🐳 Развертывание с Docker/Podman

### Создание образа

Создайте `Dockerfile` в корне проекта (уже создан):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Сборка и запуск

#### Docker
```bash
docker build -t kpop-backend .
docker run -p 3000:3000 --env-file .env kpop-backend
```

#### Podman
```bash
podman build -t kpop-backend .
podman run -p 3000:3000 --env-file .env kpop-backend
```

> 🐳 **Используете Podman?** Смотрите [PODMAN.md](./PODMAN.md) для подробных инструкций, включая работу с podman-compose, сетями, volumes и troubleshooting.

## 📚 Структура проекта

```
k-pop-backend/
├── src/
│   ├── artists/              # Модуль артистов
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entities/        # TypeORM сущности
│   │   ├── artists.controller.ts
│   │   ├── artists.service.ts
│   │   └── artists.module.ts
│   ├── app.controller.ts    # Главный контроллер
│   ├── app.service.ts       # Главный сервис
│   ├── app.module.ts        # Главный модуль
│   └── main.ts              # Точка входа
├── .env.example             # Пример переменных окружения
├── docker-compose.yml       # Docker Compose для PostgreSQL
├── nest-cli.json           # Конфигурация NestJS CLI
├── package.json            # Зависимости проекта
├── tsconfig.json           # Конфигурация TypeScript
└── README.md               # Документация
```

## 🔧 Доступные команды

- `npm run start` - запуск приложения
- `npm run start:dev` - запуск в режиме разработки с hot-reload
- `npm run start:debug` - запуск в режиме отладки
- `npm run start:prod` - запуск в продакшен режиме
- `npm run build` - сборка проекта
- `npm run format` - форматирование кода
- `npm run lint` - проверка кода линтером
- `npm run test` - запуск тестов
- `npm run test:watch` - запуск тестов в watch режиме
- `npm run test:cov` - запуск тестов с покрытием

## 🌐 API Endpoints

### Основные

- `GET /` - Welcome сообщение
- `GET /health` - Проверка здоровья приложения

### Artists (Артисты)

- `GET /artists` - Получить всех артистов
- `GET /artists/:id` - Получить артиста по ID
- `POST /artists` - Создать нового артиста
- `PATCH /artists/:id` - Обновить артиста
- `DELETE /artists/:id` - Удалить артиста

## 🔒 CORS

CORS настроен для работы с фронтендом. По умолчанию разрешены запросы с `http://localhost:3001`.

Для изменения разрешенного источника, измените переменную `CORS_ORIGIN` в `.env` файле.

## 🐛 Troubleshooting

### База данных не подключается

1. Убедитесь, что PostgreSQL запущен:

   ```bash
   docker-compose ps
   ```

2. Проверьте логи:

   ```bash
   docker-compose logs postgres
   ```

3. Проверьте настройки в `.env` файле

### Порт уже занят

Если порт 3000 уже используется, измените `PORT` в `.env` файле.

### TypeORM синхронизация

В режиме разработки TypeORM автоматически синхронизирует схему БД. В продакшене используйте миграции:

```bash
npm run typeorm migration:create -- -n MigrationName
npm run typeorm migration:run
```

## 📝 Лицензия

MIT

## 👨‍💻 Разработка

Для добавления новых модулей используйте NestJS CLI:

```bash
nest generate module module-name
nest generate controller module-name
nest generate service module-name
```

---

Создано с ❤️ для K-Pop фанатов
