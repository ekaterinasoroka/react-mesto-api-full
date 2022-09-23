const Card = require('../models/Card');
const ForbiddenError = require('../errors/ForbiddenError');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCard = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.status(200).send(card);
  } catch (error) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.createCard = async (req, res, next) => {
  const owner = req.users._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(200).send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  const userId = req.users._id;
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    if (userId !== card.owner.toString()) {
      return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
    }
    await Card.findByIdAndDelete(cardId);
    return res.status(200).send({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Некорректные данные для удаления карточки'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.users._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    return res.status(200).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Некорректные данные для постановки лайка'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.users._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new NotFoundError('Такой карточки не существует'));
    }
    return res.status(200).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Некорректные данные для постановки лайка'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};
