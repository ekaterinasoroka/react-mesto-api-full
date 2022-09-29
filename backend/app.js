require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { UserRoutes } = require('./routes/users');
const { CardRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(
  cors({
    origin: ['http://soroka.nomorepartiesxyz.ru', 'https://soroka.nomorepartiesxyz.ru'],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);

app.use(UserRoutes);
app.use(CardRoutes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка на сервере'
      : message,
  });
  next();
});

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
  } catch (error) {
    console.error(error);
  }
}

main();
