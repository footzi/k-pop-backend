# 🎯 Быстрый старт для Podman пользователей

Этот проект полностью поддерживает Podman! Вот самый быстрый способ начать:

## 🚀 Установка Podman

### macOS
```bash
brew install podman podman-compose
podman machine init
podman machine start
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install podman

# Fedora
sudo dnf install podman

# Установка podman-compose
pip3 install podman-compose
```

## ⚡ Быстрый запуск проекта

```bash
# 1. Установка зависимостей Node.js
npm install

# 2. Копирование настроек
cp .env.example .env

# 3. Запуск PostgreSQL
podman-compose up -d

# 4. Запуск приложения
npm run start:dev
```

Готово! Приложение доступно на `http://localhost:3000`

## 💡 Рекомендация: Алиасы

Создайте алиасы для полной совместимости с Docker командами:

```bash
# Добавьте в ~/.zshrc или ~/.bashrc:
alias docker='podman'
alias docker-compose='podman-compose'

# Применить
source ~/.zshrc  # или source ~/.bashrc
```

После этого все команды из документации с `docker` будут работать автоматически!

## 📚 Дополнительная документация

- **[PODMAN.md](./PODMAN.md)** - Полное руководство по Podman (400+ строк)
- **[QUICKSTART.md](./QUICKSTART.md)** - Общий быстрый старт
- **[README.md](./README.md)** - Полная документация проекта

## ✅ Проверка работы

```bash
# Health check
curl http://localhost:3000/health

# Создать тестового артиста
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"name": "BTS", "agency": "HYBE"}'

# Получить всех артистов
curl http://localhost:3000/artists
```

## 🐛 Troubleshooting

### Podman machine не запускается (macOS/Windows)
```bash
podman machine stop
podman machine rm
podman machine init
podman machine start
```

### Порт недоступен
```bash
# Убедитесь что machine запущена
podman machine list
podman machine start
```

### База данных не доступна
```bash
# Проверьте статус
podman-compose ps

# Перезапустите
podman-compose restart postgres

# Проверьте логи
podman-compose logs postgres
```

Больше информации в **[PODMAN.md](./PODMAN.md)**!

---

**Enjoy K-Pop Backend with Podman!** 🎵🐳


