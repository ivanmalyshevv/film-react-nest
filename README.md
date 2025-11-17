# FILM!

## Деплой

Приложение развернуто на Yandex Cloud:

- **Фронтенд:** http://ivanmalyshev.nomorepartiessbs.ru
- **API:** http://api.ivanmalyshev.nomorepartiessbs.ru

## Docker образы

- Frontend: `ghcr.io/ivanmalyshevv/film-react-nest-frontend:review-3`
- Backend: `ghcr.io/ivanmalyshevv/film-react-nest-backend:review-3`
- Nginx: `ghcr.io/ivanmalyshevv/film-react-nest-nginx:review-3`

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.




