var chai = require('chai');
var assert = chai.assert;

require('./models/ShaderVersion');

var foo = 'bar';

assert.typeOf(foo, 'string');
assert.equal(foo, 'bar');
