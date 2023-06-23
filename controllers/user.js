const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  HTTP_STATUS_CREATED,
} = http2.constants;

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.updateMe = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { ...req.body }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (user == null) {
        throw NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user.id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
