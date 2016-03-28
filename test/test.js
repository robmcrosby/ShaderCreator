var chai = require('chai');
var assert = chai.assert;

var foo = 'bar';

assert.typeOf(foo, 'string');
assert.equal(foo, 'bar');
