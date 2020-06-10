import collapseJoinResult from './collapseJoinResult';

it('should handle empty row', () => {
  expect(collapseJoinResult(undefined, 'descent')).toBeNull();
});

it('should collapse join result', () => {
  const input = {
    descent_id: '_foo_',
    section_id: '_bar_',
    section_name: 'baz',
    section_take_out: 11,
  };
  const expected = {
    id: '_foo_',
    section: {
      id: '_bar_',
      name: 'baz',
      take_out: 11,
    },
  };
  expect(collapseJoinResult(input, 'descent')).toEqual(expected);
});
