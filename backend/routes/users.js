const express = require('express');
const UserRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById, getUser, updateProfile, updateAvatar, getUserInfo, logout,
} = require('../controllers/users');

UserRoutes.get('/logout', express.json(), logout);
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
      .regex(/^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{1,256}\.[a-z]{1,6}\b[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*$/),
  }),
}), updateAvatar);

module.exports = {
  UserRoutes,
};
