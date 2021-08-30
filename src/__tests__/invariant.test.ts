import { invariant } from '../utils';

describe('invariant', () => {
  it('must throw', () => {
    try {
      invariant(false, 'expected');
    } catch (e) {
      expect(e.message).toStrictEqual('expected');
      expect(e).toBeInstanceOf(Error);
    }
  });
});
