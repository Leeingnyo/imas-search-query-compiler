const Token = require('./token');

var Scanner = function () {
  var SPECIAL_CHARACTERS = '[()]!=><,';

  this.parse = function (query) {
    var tokens = [];
    var c = 0;
    while (c < query.length) {
      switch (query[c]) {
        case ',': {
          tokens.push(new Token(Token.TCOM, query[c]))
        } break;
        case '=': {
          tokens.push(new Token(Token.TE, query[c]))
        } break;
        case '>': {
          if (query[c+1] === '=') {
            tokens.push(new Token(Token.TGTE, '>='));
            c++;
            break;
          } else if (query[c+1] === '>') {
            tokens.push(new Token(Token.TCON, '>>'));
            c++;
            break;
          }
          tokens.push(new Token(Token.TGT, query[c]));
        }break;
        case '<': {
          if (query[c+1] === '=') {
            tokens.push(new Token(Token.TLTE, '<='));
            c++;
            break;
          }
          tokens.push(new Token(Token.TLT, query[c]));
        } break;
        case '!': {
          if (query[c+1] === '=') {
            tokens.push(new Token(Token.TNE, '!='));
            c++;
          }
        } break;
        case '=': {
          tokens.push(new Token(Token.TE, query[c]));
        } break;
        case '(': {
          tokens.push(new Token(Token.TOP, query[c]));
        } break;
        case ')': {
          tokens.push(new Token(Token.TCP, query[c]));
        } break;
        case '[': {
          tokens.push(new Token(Token.TOB, query[c]));
        } break;
        case ']': {
          tokens.push(new Token(Token.TCB, query[c]));
        } break;
        default: {
          let tokenValue = query[c];
          while (query[c + 1] && !SPECIAL_CHARACTERS.includes(query[c + 1])) {
            tokenValue += query[c + 1];
            c++;
          }
          tokens.push(new Token(Token.TIDS, tokenValue.trim()));
        } break;
      }
      c++;
    }
    return tokens;
  }
}

module.exports = Scanner;
