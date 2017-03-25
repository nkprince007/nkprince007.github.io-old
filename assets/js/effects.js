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
            this.element.textContent = this.text.replaceAt(i-1, randomChar).toLowerCase();
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

class Chaffle {
    constructor(element, options) {
        var data = {};
        var dataLang = element.getAttribute("data-chaffle");
        var dataSpeed = element.getAttribute("data-chaffle-speed");
        var dataDelay = element.getAttribute("data-chaffle-delay");
        if (dataLang.length !== 0) data.lang = dataLang;
        if (dataSpeed !== null) data.speed = Number(dataSpeed);
        if (dataDelay !== null) data.delay = Number(dataDelay);
        this.options = {
            lang: "en",
            speed: 20,
            delay: 100
        };
        this.options = extend(this.options, options, data);
        this.element = element;
        this.text = this.element.textContent;
        this.substitution = "";
        this.state = false;
        this.shuffleProps = [];
        this.reinstateProps = [];
    }

    init() {
        var self = this;
        if (self.state) return;
        self.clearShuffleTimer();
        self.clearReinstateTimer();
        self.state = true;
        self.substitution = "";
        self.shuffleProps = [];
        self.reinstateProps = [];
        var shuffleTimer = setInterval(() => {
            self.shuffle()
        }, self.options.speed);
        var reinstateTimer = setInterval(() => {
            self.reinstate()
        }, self.options.delay);
        self.shuffleProps = shuffleTimer;
        self.reinstateProps = reinstateTimer
    }

    shuffle() {
        this.element.textContent = this.substitution;
        var textLength = this.text.length;
        var substitutionLength = this.substitution.length;
        if (textLength - substitutionLength > 0) {
            for (var i = 0; i <= textLength - substitutionLength; i++) {
                this.element.textContent = this.element.textContent + this.randomStr()
            }
        } else {
            this.clearShuffleTimer()
        }
    }

    reinstate() {
        var textLength = this.text.length;
        var substitutionLength = this.substitution.length;
        if (substitutionLength < textLength) {
            this.element.textContent = this.substitution = this.text.substr(0, substitutionLength + 1)
        } else {
            this.clearReinstateTimer()
        }
        this.state = false
    }

    clearShuffleTimer() {
        return clearInterval(this.shuffleProps)
    }

    clearReinstateTimer() {
        return clearInterval(this.reinstateProps)
    }

    randomStr() {
        var str;
        switch (this.options.lang) {
            case "en":
                str = String.fromCharCode(randomRange(33, 132));
                break;
            case "ja":
                str = String.fromCharCode(randomRange(19968, 20048));
                break;
            case "ja-hiragana":
                str = String.fromCharCode(randomRange(12352, 12402));
                break;
            case "ja-katakana":
                str = String.fromCharCode(randomRange(12448, 12532));
                break;
            case "ua":
                str = String.fromCharCode(randomRange(1040, 1090));
                break
        }
        return str
    }
};

function extend() {
    var extended = {};
    var deep = false;
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
        deep = arguments[0];
        i++;
    }

    function merge(obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                    extended[prop] = extend(true, extended[prop], obj[prop])
                } else {
                    extended[prop] = obj[prop]
                }
            }
        }
    }

    for (var i = 0; i < arguments.length; i++) {
        var obj = arguments[i];
        merge(obj)
    }
    return extended
}
