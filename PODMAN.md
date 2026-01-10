# 🐳 Работа с Podman

Этот проект полностью поддерживает Podman в качестве альтернативы Docker.

## Что такое Podman?

Podman - это контейнерный движок, совместимый с Docker, который:
- Не требует демона (daemonless)
- Работает без root прав (rootless)
- Совместим с Docker CLI
- Поддерживает Kubernetes YAML

## Установка Podman

### macOS
```bash
brew install podman
podman machine init
podman machine start
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install podman

# Fedora
sudo dnf install podman

# Arch
sudo pacman -S podman
```

### Проверка установки
```bash
podman --version
podman info
```

## Установка podman-compose

```bash
# С помощью pip
pip3 install podman-compose

# Или с помощью brew (macOS)
brew install podman-compose

# Проверка
podman-compose --version
```

## Использование в проекте

### Локальная разработка

#### Запуск PostgreSQL
```bash
# Вместо docker-compose up -d
podman-compose up -d

# Или напрямую с podman
podman run -d \
  --name kpop-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kpop_db \
  -p 5432:5432 \
  -v kpop-postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### Остановка
```bash
podman-compose down

# Или
podman stop kpop-postgres
podman rm kpop-postgres
```

#### Просмотр логов
```bash
podman-compose logs -f

# Или
podman logs -f kpop-postgres
```

### Продакшен

#### Сборка образа приложения
```bash
# Вместо docker build
podman build -t kpop-backend .
```

#### Запуск полного стека
```bash
# Используя podman-compose
podman-compose -f docker-compose.prod.yml up -d
```

#### Ручной запуск контейнеров

**1. Создание сети**
```bash
podman network create kpop-network
```

**2. Запуск PostgreSQL**
```bash
podman run -d \
  --name kpop-postgres \
  --network kpop-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kpop_db \
  -p 5432:5432 \
  -v kpop-postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine
```

**3. Запуск Backend**
```bash
podman run -d \
  --name kpop-backend \
  --network kpop-network \
  -e NODE_ENV=production \
  -e DB_HOST=kpop-postgres \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=kpop_db \
  -e CORS_ORIGIN=http://localhost:3001 \
  -p 3000:3000 \
  kpop-backend
```

## Алиасы для удобства (опционально)

Если вы хотите использовать команды `docker` и `docker-compose`:

### Добавьте в ~/.zshrc или ~/.bashrc:
```bash
alias docker='podman'
alias docker-compose='podman-compose'
```

Затем:
```bash
source ~/.zshrc  # или ~/.bashrc
```

Теперь все команды из документации с `docker` будут работать!

## Podman Desktop

Для более удобной работы можно установить Podman Desktop (GUI):

### macOS
```bash
brew install podman-desktop
```

### Linux/Windows
Скачайте с [podman-desktop.io](https://podman-desktop.io/)

## Команды для работы с проектом

### Разработка
```bash
# Запуск базы данных
podman-compose up -d

# Проверка статуса
podman-compose ps

# Просмотр логов
podman-compose logs -f postgres

# Остановка
podman-compose down

# Остановка с удалением volumes
podman-compose down -v
```

### Продакшен
```bash
# Сборка образа
podman build -t kpop-backend .

# Запуск полного стека
podman-compose -f docker-compose.prod.yml up -d

# Просмотр логов
podman-compose -f docker-compose.prod.yml logs -f

# Остановка
podman-compose -f docker-compose.prod.yml down
```

## Полезные команды Podman

```bash
# Список контейнеров
podman ps
podman ps -a  # включая остановленные

# Список образов
podman images

# Удалить контейнер
podman rm <container-name>

# Удалить образ
podman rmi <image-name>

# Подключиться к контейнеру
podman exec -it kpop-postgres psql -U postgres -d kpop_db

# Просмотр логов
podman logs -f kpop-postgres

# Информация о контейнере
podman inspect kpop-postgres

# Статистика ресурсов
podman stats

# Очистка неиспользуемых данных
podman system prune -a
```

## Работа с volumes

```bash
# Список volumes
podman volume ls

# Создать volume
podman volume create kpop-postgres-data

# Удалить volume
podman volume rm kpop-postgres-data

# Инспектировать volume
podman volume inspect kpop-postgres-data

# Очистить неиспользуемые volumes
podman volume prune
```

## Работа с сетями

```bash
# Список сетей
podman network ls

# Создать сеть
podman network create kpop-network

# Удалить сеть
podman network rm kpop-network

# Инспектировать сеть
podman network inspect kpop-network
```

## Генерация Kubernetes YAML (бонус!)

Podman может генерировать Kubernetes манифесты:

```bash
# Для контейнера
podman generate kube kpop-backend > k8s-backend.yaml

# Для pod'а
podman play kube k8s-backend.yaml
```

## Отличия от Docker

### Основные
1. **Без демона** - контейнеры запускаются напрямую
2. **Rootless по умолчанию** - повышенная безопасность
3. **Совместимость с Docker** - те же команды и форматы

### На что обратить внимание

**macOS/Windows**: Podman использует виртуальную машину
```bash
# Запуск машины
podman machine start

# Остановка машины
podman machine stop

# Информация о машине
podman machine info
```

**Порты**: На macOS/Windows порты пробрасываются через VM
```bash
# Если порт не доступен, попробуйте
podman machine ssh
```

**Volumes**: Пути могут отличаться из-за VM
```bash
# Проверьте монтирование
podman volume inspect <volume-name>
```

## Troubleshooting

### Порт недоступен
```bash
# macOS/Windows: убедитесь что машина запущена
podman machine start

# Проверьте переадресацию портов
podman machine list
```

### Ошибка подключения к базе данных
```bash
# Проверьте, что контейнеры в одной сети
podman network inspect kpop-network

# Или используйте host.containers.internal вместо localhost
# в .env файле для DB_HOST при разработке
```

### Проблемы с правами (Linux)
```bash
# Rootless Podman может иметь ограничения с портами < 1024
# Используйте порты >= 1024 или настройте:
echo "net.ipv4.ip_unprivileged_port_start=80" | sudo tee /etc/sysctl.d/podman-privileged-ports.conf
sudo sysctl --system
```

### Очистка всего (если что-то пошло не так)
```bash
# Остановить все контейнеры
podman stop -a

# Удалить все контейнеры
podman rm -a

# Удалить все образы
podman rmi -a

# Удалить все volumes
podman volume prune -a

# Полная очистка системы
podman system reset
```

## Интеграция с IDE

### VS Code
Установите расширение "Podman" для работы с контейнерами прямо из IDE.

### IntelliJ IDEA / WebStorm
Settings → Build, Execution, Deployment → Docker → выберите Podman

## Производительность

Podman может быть **быстрее** Docker на Linux (нет демона).
На macOS/Windows производительность сопоставима (обе используют VM).

## Безопасность

Podman **безопаснее** Docker по умолчанию:
- Rootless контейнеры
- Нет привилегированного демона
- Лучшая изоляция

## Миграция с Docker

Если у вас уже есть Docker образы:

```bash
# Импорт из Docker
podman load -i docker-image.tar

# Или создайте алиасы (см. выше)
alias docker='podman'
alias docker-compose='podman-compose'
```

## Полезные ссылки

- [Podman Documentation](https://docs.podman.io/)
- [Podman Desktop](https://podman-desktop.io/)
- [Podman vs Docker](https://docs.podman.io/en/latest/Introduction.html)
- [Podman Compose](https://github.com/containers/podman-compose)

---

**Совет**: Создайте алиасы для Docker команд, и вся существующая документация проекта будет работать без изменений! 🚀


