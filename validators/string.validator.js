const { checkRange } = require('./range');

const validateString = (option, params = {}) => {
  const { validations: { range, size, confirmPassword, email }, field } = option;
  const fieldValue = params[field];
  const errors = [];

  if (fieldValue) {
    if ((typeof fieldValue) !== 'string') errors.push({ field, message: `${field} must be a String.` });

    const length = fieldValue?.length;

    if (email && email.value === true) {
      const REG_EXP = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (!REG_EXP.test(fieldValue)) errors.push({ field, message: email.message || `${field} with value [${fieldValue}] is not a valid email.` });
    }

    if (range?.value) {
      const { min, max } = range?.value;

      if (checkRange(range?.value, length)) errors.push({ field, message: range?.message || `${field} must be between ${min} and ${max} characters.` });
    }

    if (size?.value && length !== size?.value) errors.push({ field, message: size?.message || `${field} must have ${size?.value} characters.` });

    if (confirmPassword && fieldValue !== params[confirmPassword?.value]) errors.push({ field, message: confirmPassword?.message || 'Confirm password doesn\'t match new password.' });
  }

  return errors;
};

module.exports = {
  validateString,
}