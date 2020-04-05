import { decodeCursor, encodeCursor } from './cursor';

it('should encode and decode without value', () => {
  const cursor = encodeCursor({ ordId: 1234 });
  const decoded = decodeCursor(cursor);
  expect(decoded).toEqual({ ordId: 1234 });
});

it('should encode and decode with value', () => {
  const cursor = encodeCursor({ ordId: 1234, value: 'foo' });
  const decoded = decodeCursor(cursor);
  expect(decoded).toEqual({ ordId: 1234, value: 'foo' });
});

it('should throw for bad cursor', () => {
  expect(() => decodeCursor('rubbish')).toThrow();
});

it('should return undefined for undefined cursor', () => {
  expect(decodeCursor()).toBeUndefined();
});
