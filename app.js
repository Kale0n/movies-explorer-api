require('dotenv').config();
const http2 = require('http2');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { PORT = 3001, DATABASE__MONGO } = process.env;
const { celebrate, Joi, errors } = require('celebrate');
const indexRouter = require('./routes/index');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cors());

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE__MONGO, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', indexRouter);
app.patch('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
