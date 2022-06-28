const customValidator = (option, body, query, params) => {
  const { validations: { custom }, field } = option;
  const errors = [];

  if (custom?.value instanceof Function) {
    const result = custom?.value(body, query, params);
    if (result) errors.push({ field, message: custom?.message || `${field} error.` });
  }

  return errors;
};

module.exports = {
  customValidator,
}