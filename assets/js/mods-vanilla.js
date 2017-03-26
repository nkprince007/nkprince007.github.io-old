"use strict";

String.prototype.toCharArray = function () {
  return this.split('');
}

Array.prototype.toString = function () {
  return this.join('');
}

String.prototype.replaceAt = function (index, character) {
  var charArray = this.toCharArray();
  charArray[index] = character;
  return charArray.toString();
}

String.prototype.trimRegex = function (regex) {
  return this.replace(regex, '');
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
