const { general } = require('./validators/general.validator');
const { validateString } = require('./validators/string.validator');
const { validateNumber } = require('./validators/number.validator');

module.exports.validate = (options) => (req, res, next) => {
  const errors = [];

  for (const it of options) {
    const { validations, source, type } = it;
    const params = req[source];

    errors.push(...general(it, params));

    switch (type) {
      case 'string':
        errors.push(...validateString(it, params));
        break;
      case 'number':
        errors.push(...validateNumber(it, params));
        break;
      default:
        break;
    }
  }

  if (errors.length) req.errors = errors;
  next();
};
