const { customValidator } = require('./custom');

const general = (option, params = {}, req) => {
  const { validations, validations: { required, equal, notEqual, inList }, field, type } = option;
  const fieldValue = params[field];
  const errors = [];

  const checkEmptyOrZero = (type === 'string' ? true : (fieldValue !== 0));

  if (required?.value && (!fieldValue && checkEmptyOrZero)) {
    errors.push({ field, message: required?.message || `${field} must be provided` });
  }

  errors.push(...customValidator(option, req['body'], req['query'], req['params']));

  if (fieldValue) {
    if (validations.hasOwnProperty("equal") && equal.value !== fieldValue) {
      errors.push({ field, message: equal.message || `${field} must be equal to [${equal?.value}]` });
    }

    if (validations.hasOwnProperty("notEqual") && notEqual.value === fieldValue) {
      errors.push({ field, message: notEqual.message || `${field} must be different than [${notEqual?.value}]` });
    }

    if (inList && !inList?.value?.includes(fieldValue)) {
      errors.push({ field, message: inList?.message || `${field} must contain one of these values [${inList?.value}].` });
    }
  }

  return errors;
};

module.exports = {
  general,
}