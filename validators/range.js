const checkRange = (range, value) => {
  const { min, max } = range;
  if (min != null && max != null) return ((!value && value !== 0) || (value < min || value > max));
  return false;
};

module.exports = {
  checkRange,
}