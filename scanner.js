const Token = require('./token');
const MyArray = require('./my-array');

function Stream(query) {
  this.stream = new MyArray(...query);
}
Stream.prototype.peek = function () {
  return this.stream[0];
}
Stream.prototype.shift = function () {
  return this.stream.shift();
}
Stream.prototype.isEmpty = function () {
  return this.stream.length === 0;
}

var Scanner = function () {
  var SPECIAL_CHARACTERS = '[()]!=><,';

  this.parse = function (query) {
    var stream = new Stream(query);
    var tokens = [];
    while (!stream.isEmpty()) {
      let tokenValue = stream.shift();
      switch (tokenValue) {
        case ',': {
          tokens.push(new Token(Token.TCOM, tokenValue))
        } break;
        case '=': {
          tokens.push(new Token(Token.TE, tokenValue))
        } break;
        case '>': {
          if (stream.peek() === '=') {
            tokenValue += stream.shift();
            tokens.push(new Token(Token.TGTE, tokenValue));
            break;
          } else if (stream.peek() === '>') {
            tokenValue += stream.shift();
            tokens.push(new Token(Token.TCON, tokenValue));
            break;
          }
          tokens.push(new Token(Token.TGT, tokenValue));
        }break;
        case '<': {
          if (stream.peek() === '=') {
            tokenValue += stream.shift();
            tokens.push(new Token(Token.TLTE, tokenValue));
            break;
          }
          tokens.push(new Token(Token.TLT, tokenValue));
        } break;
        case '!': {
          if (stream.peek() === '=') {
            tokenValue += stream.shift();
            tokens.push(new Token(Token.TNE, tokenValue));
            break;
          }
        } break;
        case '=': {
          tokens.push(new Token(Token.TE, tokenValue));
        } break;
        case '(': {
          tokens.push(new Token(Token.TOP, tokenValue));
        } break;
        case ')': {
          tokens.push(new Token(Token.TCP, tokenValue));
        } break;
        case '[': {
          tokens.push(new Token(Token.TOB, tokenValue));
        } break;
        case ']': {
          tokens.push(new Token(Token.TCB, tokenValue));
        } break;
        default: {
          while (stream.peek() && !SPECIAL_CHARACTERS.includes(stream.peek())) {
            if (stream.peek() === '\\') {
              tokenValue += stream.shift();
            }
            tokenValue += stream.shift();
          }
          tokens.push(new Token(Token.TIDS, tokenValue.replace(/\\(.)/g, '$1').trim()));
        } break;
      }
    }
    return tokens;
  }
}

module.exports = Scanner;
