const indexRouter = require('express').Router();

const movieRouter = require('./movies');
const userRouter = require('./user');

indexRouter.use('/users', userRouter);
indexRouter.use('/movies', movieRouter);

module.exports = indexRouter;
