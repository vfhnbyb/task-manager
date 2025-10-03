# Архитектура проекта: DDD (Domain Driven Design)

## 🏗️ **Структура проекта**

```
backend/
├── src/
│   ├── domain/              # Ядро приложения - бизнес-логика
│   │   ├── interfaces.js    # Интерфейсы сущностей (JSDoc)
│   │   ├── Task.js          # Доменная модель Задачи
│   │   └── repositories/    # Интерфейсы репозиториев
│   ├── application/         # Слой приложения - use cases
│   │   ├── TaskService.js   # Сервис задач
│   │   └── DocumentService.js # Сервис документов
│   ├── infrastructure/      # Внешние зависимости
│   │   ├── database/        # Работа с БД
│   │   ├── repositories/    # Реализации репозиториев
│   │   └── file-upload/     # Загрузка файлов
│   └── interfaces/          # Внешние интерфейсы
│       ├── controllers/     # HTTP контроллеры
│       ├── routes/          # Маршруты API
│       └── middleware/      # Промежуточное ПО
├── uploads/                 # Загруженные файлы
└── package.json
```
