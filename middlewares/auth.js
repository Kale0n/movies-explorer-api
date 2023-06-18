const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const AUTHORIZATION_ERROR_MESSAGE = 'Необходима авторизация';

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE);
  }

  req.user = payload;
  next();
};
