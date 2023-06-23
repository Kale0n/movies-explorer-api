const indexRouter = require('express').Router();
const http2 = require('http2');
const { auth } = require('../middlewares/auth');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

const movieRouter = require('./movies');
const userRouter = require('./user');
const signinRouter = require('./signin');
const signupRouter = require('./signup');

indexRouter.use('/signin', signinRouter);
indexRouter.use('/signup', signupRouter);

indexRouter.use('/users', auth, userRouter);
indexRouter.use('/movies', auth, movieRouter);

indexRouter.patch('*', auth, (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = indexRouter;
