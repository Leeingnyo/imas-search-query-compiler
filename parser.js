const Token = require('./token');
const Query = require('./class');

function ClassConditionNode(_class, conditions, context) {
  this.class = _class;
  this.conditions = conditions;
  this.context = context;
}
ClassConditionNode.prototype.toString = function () {
  var parent = this.context.parent;
  var isRoot = !parent;

  var className = this.class.value;
  var projection;
  if (isRoot) {
    if (!Query[className]) {
      throw new TypeError(`no class named '${className}'`);
    }
    projection = '*';
    className = Query[className].class.name;
  } else {
    const subClass = parent.class.columns[parent.class.columnsResolver(className)];
    if (!subClass) {
      throw new TypeError(`no column '${className}' in '${parent.class.name}'`);
    }
    projection = subClass.edge;
    className = subClass.class.name;
  }

  return `${isRoot ? '' : '@rid in ('}select ${projection} from ${className} where ${this.conditions.map(b => b.toString(className)).join(' and ')}${isRoot ? '' : ')'}`;
}

function ColumnConditionNode(column, operator, value, context) {
  this.column = column;
  this.operator = operator;
  this.value = value;
  this.context = context;
}
ColumnConditionNode.prototype.toString = function () {
  var parent = this.context.parent;

  if (!parent.class.columns[parent.class.columnsResolver(this.column.value)]) {
    throw new TypeError(`no column '${this.column.value}' in '${parent.class.name}'`);
  }
  if (Array.isArray(this.value)) {
    return `${parent.class.columns[parent.class.columnsResolver(this.column.value)]} ${'in' || this.operator.value} ${`[${this.value.map(item => `"${item}"`).join(', ')}]`}`;
  } else {
    return `${parent.class.columns[parent.class.columnsResolver(this.column.value)]} ${this.operator.value} ${`"${this.value.toString()}"`}`;
  }
}

const Parser = function () { };

Parser.prototype.parse = function (tokens) {
  let copied = [...tokens];
  class MyArray extends Array {
    shift() {
      if (this.length === 0) throw new RangeError('you used shift() with empty array.');
      return super.shift();
    }
  }
  return this.parseQuery(new MyArray(...copied));
};

// query := class-condition
Parser.prototype.parseQuery = function parseQuery(tokens) {
  var root = this.parseClassCondition(tokens);
  if (tokens.length !== 0) throw new SyntaxError('some tokens are left');
  return root;
};

// class-condition := letters open-parenthesis conditions close-parenthesis
Parser.prototype.parseClassCondition = function parseClassCondition(tokens, context = { parent: null }) {
  var _class = tokens.shift();
  if (tokens[0] && tokens[0].type !== Token.TOP) { throw new SyntaxError('expected open-parenthesis \'(\''); }
  tokens.shift(); // (

  var parent = context.parent;
  if (!parent) {
    var conditions = this.parseConditions(tokens, { parent: Query[_class.value] });
  } else {
    var conditions = this.parseConditions(tokens, { parent: parent.class.columns[parent.class.columnsResolver(_class.value)] });
  }

  if (tokens[0] && tokens[0].type !== Token.TCP) { throw new SyntaxError('expected close-parenthesis \')\''); }
  tokens.shift(); // )
  return new ClassConditionNode(_class, conditions, context);
};

// conditions := condition [ comma condition ] *
Parser.prototype.parseConditions = function parseConditions(tokens, context) {
  var conditions = [];
  conditions.push(this.parseCondition(tokens, context));
  while (tokens[0] && tokens[0].type === Token.TCOM) {
    tokens.shift(); // ,
    conditions.push(this.parseCondition(tokens, context));
  }
  return conditions;
};

// condition := class-condition | column-condition
Parser.prototype.parseCondition = function parseCondition(tokens, context) {
  var condition;
  if (tokens[0] && tokens[0].type !== Token.TIDS) throw new SyntaxError('expected letters');
  if (tokens[1] && tokens[1].type === Token.TOP) condition = this.parseClassCondition(tokens, context);
  else if (tokens) condition = this.parseColumnCondition(tokens, context);
  else throw new SyntaxError('expected open parenthesis or operator');
  return condition;
};

// column-condition := letters operator expression
// expression := constant | array
Parser.prototype.parseColumnCondition = function parseColumnCondition(tokens, context) {
  if (tokens[0] && tokens[0].type !== Token.TIDS) { throw new SyntaxError('expected letters'); }
  var column = tokens.shift();

  if (!Token.isOperator(tokens[0])) { throw new SyntaxError('expected operator'); }
  var operator = tokens.shift();

  var value;
  if (tokens[0] && tokens[0].type === Token.TOB) value = this.parseArray(tokens);
  else {
    if (tokens[0] && tokens[0].type !== Token.TIDS) { throw new SyntaxError('expected letters'); }
    value = this.parseConstant(tokens);
  }

  return new ColumnConditionNode(column, operator, value, context);
};

// array := open-bracket constants close-bracket
// constants := constant [ comma constant ] *
Parser.prototype.parseArray = function parseArray(tokens) {
  var values = [];
  if (tokens[0] && tokens[0].type !== Token.TOB) { throw new SyntaxError('expected open-bracket'); }
  tokens.shift(); // [

  values.push(this.parseConstant(tokens));
  while (tokens[0] && tokens[0].type === Token.TCOM) {
    tokens.shift(); // ,
    values.push(this.parseConstant(tokens));
  }

  if (tokens[0] && tokens[0].type !== Token.TCB) { throw new SyntaxError('expected close-bracket, but \'' + tokens[0].value + '\''); }
  tokens.shift(); // ]

  return values;
};

// constant := letters
Parser.prototype.parseConstant = function parseConstant(tokens) {
  var constant = tokens.shift();
  return constant.value;
};

module.exports = Parser;
