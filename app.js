require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const indexRouter = require('./routes/index');
const { errorsHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, DATABASE_MONGO } = require('./utils/config');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE_MONGO, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use('/', indexRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
