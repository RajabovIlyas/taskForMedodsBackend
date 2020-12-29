# Задание для Medods Back-end

## Установка пакета данных
```
yarn install
```
или 
```
npm install
```
## Запуск проекта
Запуск для разработчика осуществляется командой
```
yarn start:dev
```
Проект запускается на порту: http://localhost:3000
## Работа проекта
### Маршруты
В проекте реализованны 2 маршрута.

- post: ``/create_tokens/:guid`` запрос принимает параметр `guid` и по нему создает ``refresh`` и ``access`` токены
- post: ``/refresh`` получает запрос с `body` json объект с типом ``refresh`` и пересоздает токены

### Использованные библиотеки

- typescript
- jsonwebtoken
- mongoose
- express