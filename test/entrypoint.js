const chai = require('chai');
chai.use(require('sinon-chai'));

const sinon = require('sinon');

global.expect = chai.expect;
global.sinon = sinon;
