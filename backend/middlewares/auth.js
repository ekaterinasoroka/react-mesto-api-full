const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (error) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.users = payload;
  return next();
};

module.exports = auth;
