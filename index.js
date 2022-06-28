const { general } = require('./validators/general.validator');
const { validateString } = require('./validators/string.validator');
const { validateNumber } = require('./validators/number.validator');

module.exports.validate = (options) => (req, res, next) => {
  const errors = [];

  for (const it of options) {
    try {
      const { validations, source, type } = it;
      const dataSource = req[source]; // source == body || query || params

      errors.push(...general(it, dataSource, req));

      switch (type) {
        case 'string':
          errors.push(...validateString(it, dataSource));
          break;
        case 'number':
          errors.push(...validateNumber(it, dataSource));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (errors.length) req.errors = errors;
  next();
};
