const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET');
  } catch (error) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.users = payload;
  next();
};

module.exports = auth;
