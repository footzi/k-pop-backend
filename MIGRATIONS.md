# Работа с миграциями TypeORM

## ⚠️ Важная информация

В режиме разработки (`NODE_ENV=development`) TypeORM автоматически синхронизирует схему базы данных с вашими entity файлами. Это удобно для разработки, но **НЕ ДОЛЖНО** использоваться в продакшене!

Для продакшена рекомендуется использовать миграции.

## Настройка миграций

### 1. Создайте файл конфигурации TypeORM

Создайте файл `typeorm.config.ts` в корне проекта:

```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'kpop_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
```

### 2. Обновите package.json

Добавьте скрипты для работы с миграциями:

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate -d typeorm.config.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d typeorm.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d typeorm.config.ts",
    "migration:show": "npm run typeorm -- migration:show -d typeorm.config.ts"
  }
}
```

## Использование миграций

### Создание новой миграции

#### Автоматическая генерация (на основе изменений в entity)

```bash
npm run migration:generate -- src/migrations/InitialSchema
```

Эта команда автоматически создаст миграцию на основе разницы между текущей схемой БД и вашими entity.

#### Ручное создание пустой миграции

```bash
npm run migration:create -- src/migrations/AddIndexToArtists
```

Это создаст пустой файл миграции, который вы заполните вручную.

### Применение миграций

```bash
npm run migration:run
```

Эта команда применит все неприменённые миграции.

### Откат последней миграции

```bash
npm run migration:revert
```

### Просмотр статуса миграций

```bash
npm run migration:show
```

## Пример миграции

Вот как может выглядеть миграция для создания таблицы artists:

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArtistsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'debutDate',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'agency',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('artists');
  }
}
```

## Workflow для продакшена

### 1. Разработка

В development используйте `synchronize: true`:

```typescript
TypeOrmModule.forRoot({
  // ...
  synchronize: process.env.NODE_ENV === 'development',
});
```

### 2. Перед деплоем

1. Отключите `synchronize` для продакшена
2. Сгенерируйте миграции:
   ```bash
   npm run migration:generate -- src/migrations/UpdateSchema
   ```
3. Проверьте созданные миграции
4. Закоммитьте миграции в репозиторий

### 3. На продакшене

1. Примените миграции перед запуском приложения:
   ```bash
   npm run migration:run
   ```
2. Запустите приложение:
   ```bash
   npm run start:prod
   ```

## CI/CD Integration

Пример для GitHub Actions:

```yaml
- name: Run migrations
  run: npm run migration:run
  env:
    DB_HOST: ${{ secrets.DB_HOST }}
    DB_USERNAME: ${{ secrets.DB_USERNAME }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    DB_DATABASE: ${{ secrets.DB_DATABASE }}

- name: Start application
  run: npm run start:prod
```

## Docker

В `Dockerfile` добавьте команду для запуска миграций:

```dockerfile
# После копирования файлов
COPY src/migrations ./src/migrations

# В CMD используйте скрипт
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
```

Или создайте отдельный `entrypoint.sh`:

```bash
#!/bin/sh
set -e

# Запуск миграций
npm run migration:run

# Запуск приложения
exec npm run start:prod
```

## Best Practices

1. **Всегда проверяйте сгенерированные миграции** перед их применением
2. **Никогда не изменяйте уже применённые миграции** - создавайте новые
3. **Тестируйте миграции** на staging окружении перед продакшеном
4. **Делайте резервные копии БД** перед применением миграций на продакшене
5. **Используйте транзакции** в миграциях, где это возможно
6. **Документируйте сложные миграции** комментариями

## Rollback Strategy

Если что-то пошло не так:

1. Откатите последнюю миграцию:
   ```bash
   npm run migration:revert
   ```

2. Восстановите из резервной копии, если необходимо:
   ```bash
   psql -U postgres -d kpop_db < backup.sql
   ```

3. Исправьте миграцию и примените заново

## Полезные команды

```bash
# Показать статус всех миграций
npm run migration:show

# Применить все миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert

# Сгенерировать миграцию на основе изменений
npm run migration:generate -- src/migrations/MigrationName

# Создать пустую миграцию
npm run migration:create -- src/migrations/MigrationName
```

## Troubleshooting

### Ошибка: "No changes in database schema were found"

Это нормально, если вы не вносили изменений в entity. TypeORM не создаст миграцию, если нет изменений.

### Ошибка: "Table already exists"

База данных уже содержит таблицы. Варианты решения:
1. Очистите базу данных
2. Создайте базовую миграцию вручную, которая проверяет существование таблиц

### Ошибка при откате миграции

Убедитесь, что метод `down()` в миграции правильно реализован и может откатить все изменения из `up()`.

---

Для получения дополнительной информации смотрите [TypeORM Migrations Documentation](https://typeorm.io/migrations).

