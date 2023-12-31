const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { AuthorizationError } = require('../utils/errors');

const INVALID_CREDENTIALS_MESSAGE = 'Неправильные почта или пароль';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) { return validator.isEmail(v); },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  toJSON: { useProjection: true },
  autoIndex: true,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(INVALID_CREDENTIALS_MESSAGE));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError(INVALID_CREDENTIALS_MESSAGE));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
