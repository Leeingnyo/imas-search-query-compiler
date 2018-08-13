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
  var columnName;
  var projection;
  if (isRoot) {
    columnName = Query.columnsResolver(className);
    if (!Query.columns[columnName]) {
      throw new TypeError(`no class named '${className}' on root`);
    }
    projection = '*';
    className = Query.columns[columnName].class.name;
  } else {
    columnName = parent.class.columnsResolver(className);
    const subClass = parent.class.columns[columnName];
    if (!subClass) {
      throw new TypeError(`no column '${className}' in '${parent.class.name}'`);
    }
    projection = subClass.edge;
    className = subClass.class.name;
    if (this.conditions.filter(condition => condition.getType())
        .map(condition => condition.hasArrayValue() && !condition.isOperatorContains())
        .reduce((r, c) => r || c, false)) {
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
  var columnName = parent.class.columnsResolver(this.column.value);

  if (!parent.class.columns[columnName]) {
    throw new TypeError(`no column '${this.column.value}' in '${parent.class.name}'`);
  }
  if (this.operator.isContains() && !this.hasArrayValue()) {
    throw new TypeError(`conatins operator is used with not array value`);
  }
  if (this.hasArrayValue()) {
    return `${parent.class.columns[columnName]} in ${`[${this.value.map(item => `"${item}"`).join(', ')}]`}`;
  } else {
    return `${parent.class.columns[columnName]} ${this.operator.value} ${`"${this.value.toString()}"`}`;
  }
}
ColumnConditionNode.prototype.getType = function () {
  return 1;
}
ColumnConditionNode.prototype.hasArrayValue = function () {
  return Array.isArray(this.value);
}
ColumnConditionNode.prototype.isOperatorContains = function () {
  return this.operator.isContains();
}

module.exports = {
  ClassConditionNode,
  ColumnConditionNode
};
