module.exports.validate = (options) => (req, res, next) => {
  const errors = [];

  for (const it of options) {
    const params = req[it.source];

    if (it.validation?.custom instanceof Function) {
      if (it.validation?.custom(params)) errors.push({ field: it.field, message: `${it.message}` });
    }

    if (it.validation?.required && !params[it.field]) {
      errors.push({ field: it.field, message: it.message });
    }

    switch (it.type) {
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

const validateString = (option, params) => {
  const errors = [];

  if (params[option.field] && (typeof params[option.field]) !== 'string') errors.push({ field: option.field, message: `${option.field} must be a String.` });

  const length = params[option.field]?.length;
  if (option.validation?.range) {
    const { min, max } = option.validation?.range;

    if (checkRange(option.validation?.range, length)) errors.push({ field: option.field, message: `${option.field} must be between ${min} and ${max} characters.` });
  }

  if (option.validation?.size && length !== option.validation?.size) errors.push({ field: option.field, message: `${option.field} must have ${option.validation?.size} characters.` });

  return errors;
};

const validateNumber = (option, params) => {
  const errors = [];
  const value = params[option.field];

  if (!Number.isFinite(value)) errors.push({ field: option.field, message: `${option.field} must be a valid Number.` });

  if (option.validation?.range && checkRange(option.validation?.range, value)) {
    errors.push({ field: option.field, message: `${option.message}` });
  }

  return errors;
};

const checkRange = (range, value) => {
  const { min, max } = range;
  if (min != null && max != null) return (!value || (value < min || value > max));
  return false;
};
