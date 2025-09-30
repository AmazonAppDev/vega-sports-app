import {
  injectListNavigationHints,
  type A11yDirectionLabels,
} from '../injectListNavigationHints';

describe('injectListNavigationHints', () => {
  const directionLabels: A11yDirectionLabels = {
    previous: 'up',
    next: 'down',
  };

  const formatOtherItemNavigationHint = ({
    direction,
    item,
  }: {
    direction: string;
    item: string;
  }) => `Use ${direction} to go to: ${item}.`;

  const formatItemSelfActionHint = (item: string) => `You are on: ${item}.`;

  it('should return undefined when items is undefined', () => {
    const result = injectListNavigationHints(undefined, {
      directionLabels,
      formatOtherItemNavigationHint,
    });

    expect(result).toBeUndefined();
  });

  it('should return an empty array when items is an empty array', () => {
    const result = injectListNavigationHints([], {
      directionLabels,
      formatOtherItemNavigationHint,
    });

    expect(result).toEqual([]);
  });

  it('should generate hints for a single item with no additional hints', () => {
    const items = ['Item 1'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      formatItemSelfActionHint,
    });

    expect(result).toEqual([
      {
        item: 'Item 1',
        hints: ['You are on: Item 1.'],
      },
    ]);
  });

  it('should generate hints for multiple items with navigation hints', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      formatItemSelfActionHint,
    });

    expect(result).toEqual([
      {
        item: 'Item 1',
        hints: ['You are on: Item 1.', 'Use down to go to: Item 2.'],
      },
      {
        item: 'Item 2',
        hints: [
          'You are on: Item 2.',
          'Use up to go to: Item 1.',
          'Use down to go to: Item 3.',
        ],
      },
      {
        item: 'Item 3',
        hints: ['You are on: Item 3.', 'Use up to go to: Item 2.'],
      },
    ]);
  });

  it('should include firstItemAdditionalHint for the first item', () => {
    const items = ['Item 1', 'Item 2'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      firstItemAdditionalHint: 'This is the first item.',
    });

    expect(result[0]!.hints).toContain('This is the first item.');
  });

  it('should include lastItemAdditionalHint for the last item', () => {
    const items = ['Item 1', 'Item 2'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      lastItemAdditionalHint: 'This is the last item.',
    });

    expect(result[1]!.hints).toContain('This is the last item.');
  });

  it('should handle both firstItemAdditionalHint and lastItemAdditionalHint', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      firstItemAdditionalHint: 'Start here.',
      lastItemAdditionalHint: 'End here.',
    });

    expect(result[0]!.hints).toContain('Start here.');
    // ignore result[1], this is the middle item
    expect(result[2]!.hints).toContain('End here.');
  });

  it('should handle both firstItemAdditionalHint and lastItemAdditionalHint in that order in an edge case of only one item', () => {
    const items = ['Item 1'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
      firstItemAdditionalHint: 'Start here.',
      lastItemAdditionalHint: 'End here.',
    });

    expect(result[0]!.hints).toStrictEqual(['Start here.', 'End here.']);
  });

  it('should not include self-action hint if formatItemSelfActionHint is not provided', () => {
    const items = ['Item 1', 'Item 2'];
    const result = injectListNavigationHints(items, {
      directionLabels,
      formatOtherItemNavigationHint,
    });

    expect(result[0]!.hints).not.toContain('You are on:');
    expect(result[1]!.hints).not.toContain('You are on:');
  });
});
