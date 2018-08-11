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
    if (!Query.columns[Query.columnsResolver(className)]) {
      throw new TypeError(`no class named '${className}' on root`);
    }
    projection = '*';
    className = Query.columns[Query.columnsResolver(className)].class.name;
  } else {
    const subClass = parent.class.columns[parent.class.columnsResolver(className)];
    if (!subClass) {
      throw new TypeError(`no column '${className}' in '${parent.class.name}'`);
    }
    projection = subClass.edge;
    className = subClass.class.name;
    if (this.conditions.filter(condition => condition.getType()).map(condition => condition.isArray()).reduce((r, c) => r || c, false)) {
      projection = `intersect(${projection})`;
    }
  }

  return `${isRoot ? '' : '@rid in ('}select ${projection} from ${className} where ${this.conditions.map(b => b.toString(className)).join(' and ')}${isRoot ? '' : ')'}`;
}
ClassConditionNode.prototype.getType = function () {
  return 0;
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
ColumnConditionNode.prototype.getType = function () {
  return 1;
}
ColumnConditionNode.prototype.isArray = function () {
  return Array.isArray(this.value);
}

module.exports = {
  ClassConditionNode,
  ColumnConditionNode
};
