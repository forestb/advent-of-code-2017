String.prototype.paddingLeft = function (paddingValue) {
  return String(paddingValue + this).slice(-paddingValue.length);
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}