const checkRange = (range, value) => {
  const { min, max } = range;
  if (min != null && max != null) return (!value || (value < min || value > max));
  return false;
};

module.exports = {
  checkRange,
}