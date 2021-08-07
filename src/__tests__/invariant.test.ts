import { invariant } from '../utils';

describe('invariant', () => {
  it('should throw', () => {
    try {
      invariant(false, 'expected');
    } catch (e) {
      expect(e.message).toStrictEqual('expected');
      expect(e).toBeInstanceOf(Error);
    }
  });
});
