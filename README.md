Домашнє завдання. Тема 7. Аутентифікація та авторизація

Створи гілку 04-auth з гілки master.

Продовж створення REST API для роботи з колекцією контактів. Додай логіку аутентифікації / авторизації користувача через JWT.

Крок 1

1. У коді створити модель користувача для таблиці users.

{
password: {
type: DataTypes.STRING,
allowNull: false,
},
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
},
subscription: {
type: DataTypes.ENUM,
values: ["starter", "pro", "business"],
defaultValue: "starter"
},
token: {
type: DataTypes.STRING,
defaultValue: null,
},
}

2. Змінити модель контактів, щоб кожен користувач бачив тільки свої контакти. Для цього в модель контактів додати властивість

   owner: {
   type: DataTypes.INTEGER,
   allowNull: false,
   }

Крок 2

Реєстрація

1. Створити ендпоінт /auth/register

2. Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

У разі успішної валідації в моделі User створити користувача за даними, які пройшли валідацію. Для хешування паролів використовуй bcrypt або bcryptjs

Якщо пошта вже використовується кимось іншим, повернути Помилку Conflict.
В іншому випадку повернути Успішна відповідь.
Registration request

POST /auth/register
Content-Type: application/json
RequestBody: {
"email": "example@example.com",
"password": "examplepassword"
}

Registration validation error

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
"message": "Помилка від Joi або іншої бібліотеки валідації"
}

Registration conflict error

Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
"message": "Email in use"
}

Registration success response

Status: 201 Created
Content-Type: application/json
ResponseBody: {
"user": {
"email": "example@example.com",
"subscription": "starter"
}
}

Логін

1. Створити ендпоінт /auth/login

2. В моделі User знайти користувача за email.

3. Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

В іншому випадку, порівняти пароль для знайденого користувача, якщо паролі збігаються створити токен, зберегти в поточному юзера і повернути Успішна відповідь.
Якщо пароль або імейл невірний, повернути Помилку Unauthorized.
Login request

POST /auth/login
Content-Type: application/json
RequestBody: {
"email": "example@example.com",
"password": "examplepassword"
}

Login validation error

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
"message": "Помилка від Joi або іншої бібліотеки валідації"
}

Login success response

Status: 200 OK
Content-Type: application/json
ResponseBody: {
"token": "exampletoken",
"user": {
"email": "example@example.com",
"subscription": "starter"
}
}

Login auth error

Status: 401 Unauthorized
ResponseBody: {
"message": "Email or password is wrong"
}

Крок 3

Перевірка токена

Створити мідлвар для перевірки токена і додай його до всіх раутів, які повинні бути захищені.

Мідлвар бере токен з заголовків Authorization, перевіряє токен на валідність.
У випадку помилки повернути Помилку Unauthorized.
Якщо валідація пройшла успішно, отримати з токена id користувача. Знайти користувача в базі даних з цим id.
Якщо користувач існує і токен збігається з тим, що знаходиться в базі, записати його дані в req.user і викликати next().
Якщо користувача з таким id НЕ існує або токени не збігаються, повернути Помилку Unauthorized

Middleware unauthorized error

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Крок 4

Логаут

1. Створити ендпоінт /auth/logout

2. Додати в маршрут мідлвар перевірки токена.

У моделі User знайти користувача за id.
Якщо користувача не існує, повернути Помилку Unauthorized.
В іншому випадку, видалити токен у поточного юзера і повернути Успішна відповідь.
Logout request

POST /auth/logout
Authorization: "Bearer {{token}}"

Logout unauthorized error

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Logout success response

Status: 204 No Content

Крок 5

Поточний користувач - отримати дані юзера по токені

1. Створити ендпоінт /auth/current

2. Додати в раут мідлвар перевірки токена.

Якщо користувача не існує, повернути Помилку Unauthorized
В іншому випадку повернути Успішну відповідь
Current user request

GET /auth/current
Authorization: "Bearer {{token}}"

Current user unauthorized error

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Current user success response

Status: 200 OK
Content-Type: application/json
ResponseBody: {
"email": "example@example.com",
"subscription": "starter"
}

Додаткове завдання (необов'язкове)

Зробити пагінацію для колекції контактів (GET /contacts?page=1&limit=20).
Зробити фільтрацію контактів по полю обраного (GET /contacts?favorite=true)
Оновлення підписки (subscription) користувача через ендпоінт PATCH /auth/subscription. Підписка повинна мати одне з наступних значень ['starter', 'pro', 'business']
