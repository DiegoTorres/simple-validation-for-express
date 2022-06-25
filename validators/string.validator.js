const { checkRange } = require('./range');

const validateString = (option, params) => {
  const { validations: { range, size }, field } = option;
  const fieldValue = params[field];
  const errors = [];

  if (fieldValue) {
    if ((typeof fieldValue) !== 'string') errors.push({ field, message: `${option.field} must be a String.` });

    const length = fieldValue?.length;

    if (range?.value) {
      const { min, max } = range?.value;

      if (checkRange(range?.value, length)) errors.push({ field, message: range?.message || `${field} must be between ${min} and ${max} characters.` });
    }

    if (size?.value && length !== size?.value) errors.push({ field, message: size?.message || `${field} must have ${size?.value} characters.` });
  }

  return errors;
};

module.exports = {
  validateString,
}