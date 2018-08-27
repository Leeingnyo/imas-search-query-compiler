const Query = require('./class');

function ClassConditionNode(_class, conditions, context) {
  this.class = _class;
  this.conditions = conditions;
  this.context = context;
}
ClassConditionNode.prototype.toString = function () {
  var parent = this.context.parent;
  var isRoot = this.isRoot();

  var className = this.class.value;
  var columnName;
  var projection;
  if (isRoot) {
    columnName = Query.columnsResolver(className);
    if (!Query.columns[columnName]) {
      throw new Error(`no class named '${className}' on root`);
    }
    projection = '*';
    className = Query.columns[columnName].class.name;
  } else {
    columnName = parent.class.columnsResolver(className);
    const subClass = parent.class.columns[columnName];
    if (!subClass) {
      throw new Error(`no column '${className}' in '${parent.class.name}'`);
    }
    projection = subClass.edge;
    className = subClass.class.name;
    if (this.conditions.filter(condition => condition.getType())
        .map(condition => condition.hasArrayValue() && !condition.isOperatorContains())
        .reduce((r, c) => r || c, false)) {
      projection = `intersect(${projection})`;
    }
  }

  const conditions = Object.values(
    this.conditions.map(condition => ({ [condition.getColumnName()]: condition }))
        .reduce((r, c) => Object.assign(r, c), {})
  ); // remove duplicates

  return `${isRoot ? '' : '@rid in ('}select ${projection} from ${className} where ${conditions.map(b => b.toString(className)).join(' and ')}${isRoot ? ' order by id' : ')'}`;
}
ClassConditionNode.prototype.getType = function () {
  return 0;
}
ClassConditionNode.prototype.getColumnName = function () {
  return this.isRoot() ? Query.columnsResolver(this.class.value) : this.context.parent.class.columnsResolver(this.class.value);
};
ClassConditionNode.prototype.isRoot = function () {
  return !this.context.parent;
}

function ColumnConditionNode(column, operator, value, context) {
  this.column = column;
  this.operator = operator;
  this.value = value;
  this.context = context;
}
ColumnConditionNode.prototype.toString = function () {
  var parent = this.context.parent;
  var columnName = this.getColumnName();

  if (!parent.class.columns[columnName]) {
    throw new Error(`no column '${this.column.value}' in '${parent.class.name}'`);
  }
  if (this.operator.isContains() && !this.hasArrayValue()) {
    throw new Error(`conatins operator is used with non array value`);
  }
  if (this.operator.isLike() && this.hasArrayValue()) {
    throw new Error(`like operator is used with array value`);
  }
  if (this.hasArrayValue()) {
    return `${parent.class.columns[columnName]} in ${`[${this.value.map(item => `"${item}"`).join(', ')}]`}`;
  } else {
    if (this.operator.isLike()) {
      return `${parent.class.columns[columnName]} like ${`"%${this.value.toString()}%"`}`;
    }
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
ColumnConditionNode.prototype.getColumnName = function () {
  return this.context.parent.class.columnsResolver(this.column.value);
}

module.exports = {
  ClassConditionNode,
  ColumnConditionNode
};
