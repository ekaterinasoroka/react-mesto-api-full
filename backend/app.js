const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { UserRoutes } = require('./routes/users');
const { CardRoutes } = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 4000 } = process.env;
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(UserRoutes);
app.use(CardRoutes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый пользователь не найден'));
});

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
