const http2 = require('http2');
const Movie = require('../models/movies');
const { NotFoundError, WrongUserError } = require('../utils/errors');

const {
  HTTP_STATUS_CREATED,
} = http2.constants;

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).populate('owner')
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(HTTP_STATUS_CREATED).send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).populate('owner')
    .then((movie) => {
      if (movie == null) {
        throw new NotFoundError('Нет такого фильма');
      } else if (movie.owner._id.toString() !== req.user._id) {
        throw new WrongUserError('Вы не можете удалить этот фильм');
      }
      return Movie.findByIdAndRemove(req.params.movieId).populate('owner');
    })
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch(next);
};
