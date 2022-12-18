# Документация

____

## Установка и запуск

### Установка технологий

`sudo apt install nodejs` - Node.js <br>
`sudo apt install npm` - пакетный менеджер для Node.js <br>
`sudo apt install mysql-server mysql-client` - MySQL

### Установка Node.js библиотек

` npm i node-telegram-bot-api` - для работы с Telegram Bot API <br>
`npm i mysql` - для работы с MySQL

### Работа с БД

Откройте терминал в директории с дампом БД <br>
`mysql -u root -p` - войти в администратора <br>
`CREATE DATABASE arana` - создать БД arana <br>
`exit` - выходим из MySQL в терминал <br>
`mysql -u root -p arana < db.sql` - записываем наш дамп в arana

### Создание ТГ бота

Запустите бота [@BotFather](https://t.me/BotFather) <br>
`/newbot`, вписываете имя, потом username. <br>
Сохраните ваш токен

### Инициализация проекта

В файле index.js замените: <br>
`TOKEN` на полученный в предыдущем этапе токен <br>
`HOST` на `localhost`, <br>
`USERNAME` на `root`, <br>
`PASSWORD` на пустую строчку, <br>
`DATABASE` на `arana`

### Запуск 

`node index.js` или `npm start` находясь в директории с index.js

____

## API
микро-сервисы располагаются в папке ./micro_service, путь до главного файла имет вид `./micro_service/<name>/app.js`.

### Bot

Микро-сервис для запуска телеграмм бота. <br>
`constructor(config:JSON{token:string, admins:array of int, db:JSON{host:string, user:string, password:string, db: string}}` <br>

`Bot.valid(user:int, chat:int, text:string):boolean` - валидно ли сообщение. true - да, false - нет. <br>
`Bot.is_admin(user:int):boolean` - является ли пользователь администратором. true - да, false - нет. <br>
`Bot.alert_error(id:int):Promise` - возвращает pop-up о системной ошибке. <br>
`Bot.sub_alert(id:int, sub:boolean, project:string):Promise` - возвращает pop-up о отписке/подписке на проект (планету). <br>
`Bot.edit_msg(text:string, chat:int, msg_id:int, buttons:InlineKeyboard(array of arrays)):Promise` - изменяет сообщение. <br>
`Bot.run():undefined` - запускает бота. <br>
`Bot.notify(users:array of int, message:string):Promise` - отправляет рассылку. <br>
`Bot.user_text(user:int, text:string):Promise/undefined` - обрабатывает текстовое сообщение от пользователя. <br>
`Bot.user_button(user:int, data:string, id:int, msg_id:int):Promise/undefined` - обрабатывает нажатие кнопки пользователем. <br>
`Bot.admin_text(user:int, text:string):Promise` - обрабатывает текстовое сообщение от администратора.

### Database

Микро-сервис для работы с БД в MySQL. <br>
`constructor(config:JSON{host:string, user:string, password:string, db: string})` <br>

`Database.query(query:string):Promise` - делает запрос в БД <br>
`Database.is_registered(user:int):Promise` - возвращает информацию зарегистрирован ли пользователь в системе. <br>
`Database.register(user:int):Promise` - записывает пользователя в БД (регистрирует в системе). <br>
`Database.get_id(user:int):Promise` - возвращает id (в бд) пользователя. <br>
`Database.get_user(user:int):Promise` - возвращает список подписок пользователя. <br>
`Database.sub(id:int, project:string):Promise` - подписывает пользователя на проект (планету). <br>
`Database.unsub(id:int, project:string):Promise` - отписывает пользователя от проекта (планеты). <br>
`Dataabase.statistic():Promise` - возвращает информацию о подписках, сколько подписчиков в каждой из них.

### Talker

Микро-сервис для реализации текстовых сообщений и кнопок. <br>
`constructor()` <br>

`Talker.header:string` - заголовок ("шапка") для ответных сообщений пользователю. <br>
`Talker.header2:string` - заголовок ("шапка") для ответных сообщений администратору. <br>
`Talker.error():array[:string, :InlineKeyboard(array of arrays)]` - сообщение о системной ошибки. <br>
`Talker.start():array[:string, :InlineKeyboard(array of arrays)]` - приветственное сообщение. <br>
`Talker.projects(sub:boolean):array[:string, :InlineKeyboard(array of arrays)]` - сообщение о том, что пользователь отписался/подписался на проект (планету). <br>
`Talker.admin():array[:string, :InlineKeyboard(array of arrays)]` - справочная информация о командах для администратора. <br>
`Talker.statistic(sub:array of int):array[:string, :InlineKeyboard(array of arrays)]` - сообщение с информацией о подписках, сколько подписчиков в каждой из них.
