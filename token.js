var Token = function (type, value) {
  this.type = type;
  this.value = value;
};

Token.TIDS = Symbol(0);
Token.TIDS = Symbol(1);
Token.TOP = Symbol(2);
Token.TCP = Symbol(3);
Token.TOB = Symbol(4);
Token.TCB = Symbol(5);
Token.TGTE = Symbol(6);
Token.TLTE = Symbol(7);
Token.TE = Symbol(8);
Token.TNE = Symbol(9);
Token.TGT = Symbol(10);
Token.TLT = Symbol(11);
Token.TCON = Symbol(12);
Token.TCOM = Symbol(13);

Token.prototype.toString = function () {
  return `{ type: ${this.type}, value ${this.value} }`
}
Token.prototype.isOperator = function () {
  return [Token.TGTE, Token.TLTE, Token.TE, Token.TNE, Token.TGT, Token.TLT, Token.TCON].includes(this.type);
}
Token.prototype.isContains = function () {
  return this.type === Token.TCON;
}

module.exports = Token;
