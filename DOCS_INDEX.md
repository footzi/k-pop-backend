# 📝 Документация проекта

## Файлы документации

Проект включает следующие файлы документации:

### 📖 [README.md](./README.md)
Основная документация проекта:
- Описание технологий
- Полная инструкция по установке
- Настройка переменных окружения
- Структура проекта
- Доступные команды
- API endpoints
- Troubleshooting

### 🚀 [QUICKSTART.md](./QUICKSTART.md)
Быстрый старт для разработчиков:
- Минимальные шаги для запуска локально
- Быстрый запуск в продакшене
- Docker/Podman инструкции
- Полезные команды
- Структура базы данных

### 🐳 [PODMAN.md](./PODMAN.md)
Полное руководство по работе с Podman:
- Установка и настройка Podman
- Использование podman-compose
- Работа с контейнерами, сетями, volumes
- Генерация Kubernetes YAML
- Troubleshooting для Podman
- Миграция с Docker на Podman

### 🔌 [API_EXAMPLES.md](./API_EXAMPLES.md)
Примеры работы с API:
- Все доступные endpoints
- Примеры запросов (curl, httpie)
- Тестовые данные
- Коды ответов
- Примеры ошибок валидации

### 🔄 [MIGRATIONS.md](./MIGRATIONS.md)
Работа с миграциями базы данных:
- Настройка миграций TypeORM
- Создание и применение миграций
- Best practices для продакшена
- CI/CD интеграция
- Rollback стратегии

## Быстрая навигация

### Для быстрого старта
👉 Начните с [QUICKSTART.md](./QUICKSTART.md)

### Используете Podman вместо Docker?
👉 Смотрите [PODMAN.md](./PODMAN.md)

### Для понимания API
👉 Смотрите [API_EXAMPLES.md](./API_EXAMPLES.md)

### Для настройки продакшена
👉 Читайте [README.md](./README.md) и [MIGRATIONS.md](./MIGRATIONS.md)

## Структура проекта

```
k-pop-backend/
├── 📄 README.md                 # Основная документация
├── 📄 QUICKSTART.md             # Быстрый старт
├── 📄 API_EXAMPLES.md           # Примеры API
├── 📄 MIGRATIONS.md             # Миграции БД
├── 📄 package.json              # Зависимости
├── 📄 docker-compose.yml        # Docker для разработки
├── 📄 docker-compose.prod.yml   # Docker для продакшена
├── 📄 Dockerfile                # Production образ
├── 📄 .env.example              # Пример переменных окружения
│
└── 📁 src/                      # Исходный код
    ├── main.ts                  # Точка входа
    ├── app.module.ts            # Главный модуль
    ├── app.controller.ts        # Главный контроллер
    ├── app.service.ts           # Главный сервис
    │
    └── 📁 artists/              # Модуль артистов
        ├── artists.module.ts
        ├── artists.controller.ts
        ├── artists.service.ts
        ├── 📁 dto/              # Data Transfer Objects
        │   ├── create-artist.dto.ts
        │   └── update-artist.dto.ts
        └── 📁 entities/         # TypeORM сущности
            └── artist.entity.ts
```

## Основные технологии

- **NestJS** v10 - прогрессивный Node.js фреймворк
- **PostgreSQL** v15 - реляционная база данных
- **TypeORM** v0.3 - ORM для работы с БД
- **TypeScript** v5 - типизированный JavaScript
- **Docker** - контейнеризация

## Быстрые команды

### Разработка
```bash
npm install              # Установка зависимостей
docker-compose up -d     # Запуск PostgreSQL
npm run start:dev        # Запуск в режиме разработки
```

### Продакшен
```bash
npm run build            # Сборка проекта
npm run start:prod       # Запуск в продакшене
```

### Docker
```bash
docker build -t kpop-backend .                    # Сборка образа
docker-compose -f docker-compose.prod.yml up -d   # Запуск полного стека
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=kpop_db
CORS_ORIGIN=http://localhost:3001
```

## API Endpoints

### Health
- `GET /health` - Проверка здоровья

### Artists
- `GET /artists` - Получить всех артистов
- `GET /artists/:id` - Получить артиста
- `POST /artists` - Создать артиста
- `PATCH /artists/:id` - Обновить артиста
- `DELETE /artists/:id` - Удалить артиста

## Полезные ссылки

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

Создано для K-Pop фанатов 🎵✨

