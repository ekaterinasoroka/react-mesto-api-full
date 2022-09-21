const express = require('express');
const UserRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, getUserById, getUser, updateProfile, updateAvatar, login, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

UserRoutes.post('/signup', express.json(), celebrate({
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
UserRoutes.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
UserRoutes.use(auth);
UserRoutes.get('/users', express.json(), getUser);
UserRoutes.get('/users/me', express.json(), getUserInfo);
UserRoutes.get('/users/:userId', express.json(), celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().alphanum().length(24),
  }),
}), getUserById);

UserRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
UserRoutes.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
  }),
}), updateAvatar);

module.exports = {
  UserRoutes,
};
