
console.log('START LIB.....');
module.exports.validate = (options) => (req, res, next) => {
  const errors = [];

  for (const it of options) {
    const { validation, field, source, message, type } = it;
    const params = req[source];
    const fieldValue = params[field];


    console.log('==================================================');
    console.log(validation);
    console.log('==================================================');


    if (validation?.custom instanceof Function) {
      if (validation?.custom(params)) errors.push({ field: field, message: `${message}` });
    }

    if (validation?.required && !fieldValue) {
      errors.push({ field: field, message: `${field} must be provided` });
    }

    if (validation.hasOwnProperty("equal") && validation?.equal !== fieldValue) {
      errors.push({ field: field, message: `${field} must be equal to [${validation?.equal}]` });
    }

    if (validation.hasOwnProperty("notEqual") && validation?.notEqual === fieldValue) {
      errors.push({ field: field, message: `${field} must be not equal to [${validation?.notEqual}]` });
    }

    if (validation?.inList && !validation?.inList.includes(fieldValue)) {
      errors.push({ field: field, message: message || `${field} must contain one of these values [${validation?.inList}].` });
    }

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
    const { min, max } = option.validation?.range;
    errors.push({ field: option.field, message: `${option.field} must be between ${min} and ${max}.` });
  }

  return errors;
};

const checkRange = (range, value) => {
  const { min, max } = range;
  if (min != null && max != null) return (!value || (value < min || value > max));
  return false;
};
