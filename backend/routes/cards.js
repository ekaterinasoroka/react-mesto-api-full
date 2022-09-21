const express = require('express');
const CardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

CardRoutes.post('/cards', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
  }),
}), createCard);
CardRoutes.get('/cards', express.json(), getCard);
CardRoutes.delete('/cards/:cardId', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24),
  }),
}), deleteCardById);
CardRoutes.put('/cards/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24),
  }),
}), likeCard);
CardRoutes.delete('/cards/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = {
  CardRoutes,
};
