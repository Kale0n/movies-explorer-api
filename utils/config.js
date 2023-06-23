const { DATABASE_MONGO = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { PORT = 3001 } = process.env;

module.exports = {
  DATABASE_MONGO,
  PORT,
};
