const Scanner = require('./scanner');
const Parser = require('./parser');

function SearchQueryCompiler() {
  this.scanner = new Scanner();
  this.parser = new Parser();
}
SearchQueryCompiler.prototype.compile = function (query) {
  const tokens = this.scanner.parse(query);
  // lexical analyze
  const ast = this.parser.parse(tokens);
  // syntax analyze
  return ast.toString();
}

module.exports = SearchQueryCompiler;
