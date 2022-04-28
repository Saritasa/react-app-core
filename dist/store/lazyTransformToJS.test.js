'use strict';

var _immutable = require('immutable');

var _lazyTransformToJS = require('./lazyTransformToJS');

describe('Store::lazyTransformToJS', function () {
  var _process = process,
      env = _process.env;

  var arg = void 0;

  beforeEach(function () {
    process.env = Object.assign({}, env);
    process.env.NODE_ENV = 'not-prod';
    arg = (0, _immutable.fromJS)({});
  });

  afterEach(function () {
    process.env = env;
  });

  describe('in production mode', function () {
    beforeEach(function () {
      process.env.NODE_ENV = 'production';
    });

    it("returns state's object if it's a regular object", function () {
      arg = {};
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });

    it("returns state's object if it's an array", function () {
      arg = [];
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });

    it("returns state's immutable object without transforms", function () {
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });

    it("returns state's immutable list without transforms", function () {
      arg = (0, _immutable.fromJS)([]);
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });
  });

  describe('in dev mode', function () {
    it("returns state's object if it's a regular object", function () {
      arg = {};
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });

    it("returns state's object if it's an array", function () {
      arg = [];
      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg)).to.be.equal(arg);
    });

    it("returns state's object with the same fields as immutable state", function () {
      arg = arg.merge({
        a: 1,
        b: 2,
        c: 3,
        d: 4
      });
      expect(Object.keys((0, _lazyTransformToJS.lazyTransformToJS)(arg))).to.be.deep.equal(['a', 'b', 'c', 'd']);
    });

    it("returns state's object with getters", function () {
      arg = arg.merge({
        a: 1
      });

      var descriptor = Object.getOwnPropertyDescriptor((0, _lazyTransformToJS.lazyTransformToJS)(arg), 'a');

      expect(descriptor.get).to.be.instanceOf(Function);
    });

    it("returns state's field value if it is not immutable", function () {
      var a = { b: 2 };

      arg = arg.set('a', a);

      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg).a).to.be.equal(a);
    });

    it("returns state's field transformetTo js value if it is immutable", function () {
      var a = { b: 2 };

      arg = arg.merge({ a: a });

      expect((0, _lazyTransformToJS.lazyTransformToJS)(arg).a).to.be.deep.equal(a);
    });
  });
});