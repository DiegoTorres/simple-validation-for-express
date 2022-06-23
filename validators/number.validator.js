const { checkRange } = require('./range');

exports.validateNumber = (option, params) => {
  const { validation: { range }, field } = option;
  const errors = [];
  const fieldValue = params[option.field];

  if (!Number.isFinite(fieldValue)) errors.push({ field, message: `${field} must be a valid Number.` });

  if (range?.value && checkRange(range?.value, fieldValue)) {
    const { min, max } = range?.value;
    errors.push({ field, message: range?.message || `${field} must be between ${min} and ${max}.` });
  }

  return errors;
};