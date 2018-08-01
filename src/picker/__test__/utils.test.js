import { paddingLeft, formatTimestamp } from '../utils';

describe('utils', () => {
  it('paddingLeft', () => {
    expect(paddingLeft(2, 2)).toBe('02');
    expect(paddingLeft(2, 5)).toBe('00002');
    expect(paddingLeft(20, 5)).toBe('00020');
    expect(paddingLeft(12, 2)).toBe('12');
    expect(paddingLeft(123, 2)).toBe('123');
  });

  it('formatTimestamp', () => {
    const time = 1532944422635;

    const result = formatTimestamp(time);
    expect(result).toBe('2018-07-30');

    const result2 = formatTimestamp(time, '');
    expect(result2).toEqual(new Date(1532944422635));
  });
});
