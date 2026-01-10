# Примеры API запросов для K-Pop Backend

## Health Check

### Проверка статуса приложения
```bash
GET http://localhost:3000/health
```

### Welcome сообщение
```bash
GET http://localhost:3000/
```

## Artists API

### 1. Получить всех артистов
```bash
GET http://localhost:3000/artists
```

### 2. Получить артиста по ID
```bash
GET http://localhost:3000/artists/550e8400-e29b-41d4-a716-446655440000
```

### 3. Создать нового артиста
```bash
POST http://localhost:3000/artists
Content-Type: application/json

{
  "name": "BTS",
  "debutDate": "2013-06-13",
  "agency": "HYBE",
  "description": "Южнокорейский бойз-бэнд, сформированный в 2010 году в Сеуле",
  "imageUrl": "https://example.com/bts.jpg"
}
```

### 4. Создать артиста (минимальные данные)
```bash
POST http://localhost:3000/artists
Content-Type: application/json

{
  "name": "BLACKPINK"
}
```

### 5. Обновить артиста
```bash
PATCH http://localhost:3000/artists/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "name": "BTS (방탄소년단)",
  "description": "Обновленное описание группы BTS"
}
```

### 6. Удалить артиста
```bash
DELETE http://localhost:3000/artists/550e8400-e29b-41d4-a716-446655440000
```

## Примеры с curl

### Создать артиста
```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TWICE",
    "debutDate": "2015-10-20",
    "agency": "JYP Entertainment",
    "description": "Южнокорейская герл-группа",
    "imageUrl": "https://example.com/twice.jpg"
  }'
```

### Получить всех артистов
```bash
curl http://localhost:3000/artists
```

### Получить артиста по ID
```bash
curl http://localhost:3000/artists/{artist-id}
```

### Обновить артиста
```bash
curl -X PATCH http://localhost:3000/artists/{artist-id} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Новое описание"
  }'
```

### Удалить артиста
```bash
curl -X DELETE http://localhost:3000/artists/{artist-id}
```

## Примеры с httpie

### Установка httpie
```bash
pip install httpie
```

### Создать артиста
```bash
http POST localhost:3000/artists \
  name="SEVENTEEN" \
  debutDate="2015-05-26" \
  agency="Pledis Entertainment" \
  description="Южнокорейский бойз-бэнд из 13 участников"
```

### Получить всех артистов
```bash
http GET localhost:3000/artists
```

### Обновить артиста
```bash
http PATCH localhost:3000/artists/{artist-id} \
  name="SEVENTEEN (세븐틴)"
```

## Тестовые данные

### Создание нескольких артистов для тестирования

#### BTS
```json
{
  "name": "BTS",
  "debutDate": "2013-06-13",
  "agency": "HYBE",
  "description": "Южнокорейский бойз-бэнд из 7 участников",
  "imageUrl": "https://example.com/bts.jpg"
}
```

#### BLACKPINK
```json
{
  "name": "BLACKPINK",
  "debutDate": "2016-08-08",
  "agency": "YG Entertainment",
  "description": "Южнокорейская герл-группа из 4 участниц",
  "imageUrl": "https://example.com/blackpink.jpg"
}
```

#### TWICE
```json
{
  "name": "TWICE",
  "debutDate": "2015-10-20",
  "agency": "JYP Entertainment",
  "description": "Южнокорейская герл-группа из 9 участниц",
  "imageUrl": "https://example.com/twice.jpg"
}
```

#### EXO
```json
{
  "name": "EXO",
  "debutDate": "2012-04-08",
  "agency": "SM Entertainment",
  "description": "Южнокорейско-китайский бойз-бэнд",
  "imageUrl": "https://example.com/exo.jpg"
}
```

#### Red Velvet
```json
{
  "name": "Red Velvet",
  "debutDate": "2014-08-01",
  "agency": "SM Entertainment",
  "description": "Южнокорейская герл-группа из 5 участниц",
  "imageUrl": "https://example.com/redvelvet.jpg"
}
```

## Коды ответов

- `200 OK` - Успешный GET/PATCH запрос
- `201 Created` - Успешное создание ресурса (POST)
- `204 No Content` - Успешное удаление (DELETE)
- `400 Bad Request` - Ошибка валидации
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Ошибка сервера

## Структура ответа Artist

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "BTS",
  "debutDate": "2013-06-13",
  "agency": "HYBE",
  "description": "Южнокорейский бойз-бэнд из 7 участников",
  "imageUrl": "https://example.com/bts.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Ошибки валидации

### Попытка создать артиста без имени
```bash
POST http://localhost:3000/artists
Content-Type: application/json

{
  "debutDate": "2013-06-13"
}
```

Ответ:
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be a string"
  ],
  "error": "Bad Request"
}
```

### Попытка создать артиста с невалидным URL
```bash
POST http://localhost:3000/artists
Content-Type: application/json

{
  "name": "BTS",
  "imageUrl": "not-a-url"
}
```

Ответ:
```json
{
  "statusCode": 400,
  "message": [
    "imageUrl must be an URL address"
  ],
  "error": "Bad Request"
}
```

