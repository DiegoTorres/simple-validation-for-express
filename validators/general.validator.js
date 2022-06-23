const general = (option, params) => {
  const { validations, validations: { required, custom, equal, notEqual, inList }, field } = option;
  const fieldValue = params[field];
  const errors = [];

  if (required?.value && !fieldValue) {
    errors.push({ field, message: required?.message || `${field} must be provided` });
  }

  if (custom?.value instanceof Function) {
    if (custom?.value(params)) errors.push({ field, message: custom?.message || `${field} error.` });
  }

  if (validations.hasOwnProperty("equal") && equal.value !== fieldValue) {
    errors.push({ field, message: equal.message || `${field} must be equal to [${equal?.value}]` });
  }

  if (validations.hasOwnProperty("notEqual") && notEqual === fieldValue) {
    errors.push({ field, message: notEqual.message || `${field} must be not equal to [${notEqual?.value}]` });
  }

  if (inList && !inList?.value?.includes(fieldValue)) {
    errors.push({ field, message: inList?.message || `${field} must contain one of these values [${inList?.value}].` });
  }

  return errors;
};

module.exports = {
  general,
}