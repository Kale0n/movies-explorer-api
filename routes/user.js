const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateMe, getMe,
} = require('../controllers/user');

userRouter.get('/me', getMe);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateMe);

module.exports = userRouter;
