import ShaderVersion from "../../js/models/ShaderVersion";

var chai = require('chai');
var assert = chai.assert;

var versions = ShaderVersion.supportedVersions();
assert.lengthOf(versions, 3);
