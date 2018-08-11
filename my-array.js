class MyArray extends Array {
  shift() {
    if (this.length === 0) throw new RangeError('you used shift() with empty array.');
    return super.shift();
  }
}

module.exports = MyArray;
