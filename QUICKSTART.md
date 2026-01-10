# 🚀 Быстрый старт K-Pop Backend

> 🐳 **Используете Podman?** См. [PODMAN.md](./PODMAN.md) для подробных инструкций

## Локальная разработка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

```bash
# Скопируйте .env.example в .env
cp .env.example .env

# .env файл уже содержит настройки по умолчанию для локальной разработки
```

### 3. Запуск PostgreSQL

#### Вариант A: Docker

```bash
docker-compose up -d
```

#### Вариант B: Podman

```bash
podman-compose up -d
# или создайте алиас: alias docker-compose='podman-compose'
```

### 4. Запуск приложения

```bash
npm run start:dev
```

Приложение запустится на `http://localhost:3000`

### 5. Проверка работы

```bash
# Health check
curl http://localhost:3000/health

# Получить список артистов (будет пустой массив)
curl http://localhost:3000/artists

# Создать тестового артиста
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"name": "BTS", "debutDate": "2013-06-13", "agency": "HYBE"}'
```

## Продакшн

### Вариант 1: Запуск через npm

```bash
# 1. Установка зависимостей
npm ci --only=production

# 2. Настройка .env для продакшена
# Измените DB_HOST, DB_PASSWORD, CORS_ORIGIN и другие переменные

# 3. Сборка
npm run build

# 4. Запуск
npm run start:prod
```

### Вариант 2: Запуск через Docker/Podman

#### Docker

```bash
# 1. Сборка образа
docker build -t kpop-backend .

# 2. Запуск контейнера
docker run -d \
  -p 3000:3000 \
  --name kpop-backend \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_USERNAME=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_DATABASE=kpop_db \
  -e CORS_ORIGIN=https://your-frontend.com \
  kpop-backend

# 3. Проверка логов
docker logs -f kpop-backend
```

#### Podman

```bash
# 1. Сборка образа
podman build -t kpop-backend .

# 2. Запуск контейнера
podman run -d \
  -p 3000:3000 \
  --name kpop-backend \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_USERNAME=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_DATABASE=kpop_db \
  -e CORS_ORIGIN=https://your-frontend.com \
  kpop-backend

# 3. Проверка логов
podman logs -f kpop-backend
```

### Вариант 3: Docker/Podman Compose (полный стек)

Создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USERNAME}']
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    restart: always
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
      CORS_ORIGIN: ${CORS_ORIGIN}
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

Запуск:

```bash
# Docker
docker-compose -f docker-compose.prod.yml up -d

# Podman
podman-compose -f docker-compose.prod.yml up -d
```

## Полезные команды

```bash
# Остановить базу данных
docker-compose down       # или: podman-compose down

# Остановить и удалить данные базы
docker-compose down -v    # или: podman-compose down -v

# Посмотреть логи базы данных
docker-compose logs -f postgres    # или: podman-compose logs -f postgres

# Подключиться к базе данных
docker-compose exec postgres psql -U postgres -d kpop_db
# или: podman exec -it kpop-postgres psql -U postgres -d kpop_db

# Форматирование кода
npm run format

# Проверка линтером
npm run lint

# Запуск тестов
npm run test

# Сборка проекта
npm run build
```

## Структура базы данных

### Таблица: artists

| Поле        | Тип          | Описание                 |
| ----------- | ------------ | ------------------------ |
| id          | UUID         | Уникальный идентификатор |
| name        | VARCHAR(255) | Имя артиста/группы       |
| debutDate   | VARCHAR(100) | Дата дебюта              |
| agency      | VARCHAR(255) | Агентство                |
| description | TEXT         | Описание                 |
| imageUrl    | VARCHAR(500) | URL изображения          |
| createdAt   | TIMESTAMP    | Дата создания записи     |
| updatedAt   | TIMESTAMP    | Дата обновления записи   |

## Переменные окружения

| Переменная  | Описание             | Значение по умолчанию |
| ----------- | -------------------- | --------------------- |
| NODE_ENV    | Окружение            | development           |
| PORT        | Порт приложения      | 3000                  |
| DB_HOST     | Хост PostgreSQL      | localhost             |
| DB_PORT     | Порт PostgreSQL      | 5432                  |
| DB_USERNAME | Имя пользователя БД  | postgres              |
| DB_PASSWORD | Пароль БД            | postgres              |
| DB_DATABASE | Имя базы данных      | kpop_db               |
| CORS_ORIGIN | Разрешенный источник | http://localhost:3001 |

## Troubleshooting

### Ошибка: "Port 3000 is already in use"

```bash
# Найти процесс на порту 3000
lsof -i :3000

# Убить процесс
kill -9 <PID>

# Или измените PORT в .env файле
```

### Ошибка: "Connection refused" при подключении к БД

```bash
# Docker: Проверьте статус контейнера
docker-compose ps
docker-compose restart postgres
docker-compose logs postgres

# Podman: Проверьте статус контейнера
podman-compose ps
podman-compose restart postgres
podman-compose logs postgres
```

### База данных не создается автоматически

```bash
# Docker: Подключитесь к PostgreSQL
docker-compose exec postgres psql -U postgres

# Podman: Подключитесь к PostgreSQL
podman exec -it kpop-postgres psql -U postgres

# Создайте базу вручную
CREATE DATABASE kpop_db;

# Выход
\q
```

### Очистка и пересоздание БД

```bash
# Docker: Остановить и удалить все данные
docker-compose down -v
docker-compose up -d

# Podman: Остановить и удалить все данные
podman-compose down -v
podman-compose up -d

# Приложение автоматически создаст таблицы при запуске
```

## Следующие шаги

1. ✅ Установите зависимости и запустите проект
2. ✅ Создайте несколько тестовых артистов
3. 📝 Добавьте новые модули (альбомы, песни, и т.д.)
4. 🔐 Добавьте аутентификацию и авторизацию
5. 📊 Добавьте пагинацию и фильтрацию
6. 🖼️ Интегрируйте загрузку изображений
7. 🔍 Добавьте поиск
8. 📱 Подключите фронтенд приложение

## Полезные ссылки

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

Удачи в разработке! 🎵✨
