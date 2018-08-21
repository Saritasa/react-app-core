import { fromJS } from 'immutable';

import { lazyTransformToJS as transform } from './lazyTransformToJS';

describe('Store::lazyTransformToJS', () => {
  const { env } = process;
  let arg;

  beforeEach(() => {
    process.env = Object.assign({}, env);
    process.env.NODE_ENV = 'not-prod';
    arg = fromJS({});
  });

  afterEach(() => {
    process.env = env;
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it("returns state's object if it's a regular object", () => {
      arg = {};
      expect(transform(arg)).to.be.equal(arg);
    });

    it("returns state's object if it's an array", () => {
      arg = [];
      expect(transform(arg)).to.be.equal(arg);
    });

    it("returns state's immutable object without transforms", () => {
      expect(transform(arg)).to.be.equal(arg);
    });

    it("returns state's immutable list without transforms", () => {
      arg = fromJS([]);
      expect(transform(arg)).to.be.equal(arg);
    });
  });

  describe('in dev mode', () => {
    it("returns state's object if it's a regular object", () => {
      arg = {};
      expect(transform(arg)).to.be.equal(arg);
    });

    it("returns state's object if it's an array", () => {
      arg = [];
      expect(transform(arg)).to.be.equal(arg);
    });

    it("returns state's object with the same fields as immutable state", () => {
      arg = arg.merge({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
      expect(Object.keys(transform(arg))).to.be.deep.equal(['a', 'b', 'c', 'd']);
    });

    it("returns state's object with getters", () => {
      arg = arg.merge({
        a: 1,
      });

      const descriptor = Object.getOwnPropertyDescriptor(transform(arg), 'a');

      expect(descriptor.get).to.be.instanceOf(Function);
    });

    it("returns state's field value if it is not immutable", () => {
      const a = { b: 2 };

      arg = arg.set('a', a);

      expect(transform(arg).a).to.be.equal(a);
    });

    it("returns state's field transformetTo js value if it is immutable", () => {
      const a = { b: 2 };

      arg = arg.merge({ a });

      expect(transform(arg).a).to.be.deep.equal(a);
    });
  });
});
