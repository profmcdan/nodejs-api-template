import calc from './calc';

describe('Calc', () => {
  test('should return return 10 for add(4,6)', () => {
    expect(calc.add(4, 6)).toBe(10);
  });

  test('should return 9 for add(10, -1)', () => {
    expect(calc.add(10, -1)).toBe(9);
  });
});
