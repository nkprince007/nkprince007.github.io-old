"use strict";

class Juggle {
  constructor(element, options) {
    this.element = element;
    this.options = {
      speed: 250,
      case: 'lower'
    };
    this.text = this.element.textContent;
    this.active = false;
    this.randomizeTimer = null;
  }

  init() {
    if (this.active) return;
    this.state = true;
    this.randomize();
  }

  randomize() {
    var self = this;
    let textLength = this.text.length;
    for (var i = 0; i < textLength;) {
      var randomChar = String.fromCharCode(randomRange(33, 132));
      this.element.textContent = this.text.replaceAt(i - 1, randomChar).toLowerCase();
      i += Math.round(Math.random() * textLength);
    }

    if (self.state) {
      var randomTime = Math.round(Math.random() * this.options.speed);
      setTimeout(() => self.randomize(), randomTime);
    } else {
      this.element.textContent = this.text;
    }
  }

  stop() {
    this.state = false;
  }
}
