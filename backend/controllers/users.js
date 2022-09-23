const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  const id = req.users._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (error) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new BadRequestError('Некорректные данные ввода'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });
    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные ввода'));
    }
    if (error.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неправильный логин или пароль'));
    }
    const userValid = await bcrypt.compare(password, user.password);
    if (!userValid) {
      return next(new UnauthorizedError('Неправильный логин или пароль'));
    }

    const token = jwt.sign({
      _id: user._id,
    }, 'SECRET');
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send(user.toJSON());
  } catch (error) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const owner = req.users._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные ввода'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const owner = req.users._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'ValidatorError') {
      return next(new BadRequestError('Некорректные данные ввода'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    return res.status(200).send({ message: 'Выполнен выход' });
  } catch (error) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};
