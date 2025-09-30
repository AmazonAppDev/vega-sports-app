import {
  injectListNavigationHints,
  type InjectListNavigationHintsOptions,
} from '../injectListNavigationHints';
import { makeListNavigationHintPropsGenerator } from '../makeListNavigationHintPropsGenerator';

jest.mock('../injectListNavigationHints');

type TestItem = { id: number };

describe('makeListNavigationHintPropsGenerator', () => {
  beforeEach(() => {
    (injectListNavigationHints as jest.Mock)
      .mockClear()
      .mockImplementation((items) =>
        items.map(() => ({ hints: ['Hint 1', 'Hint 2'] })),
      );
  });

  const mockItems: TestItem[] = [{ id: 1 }, { id: 2 }];
  const mockOptions: InjectListNavigationHintsOptions<TestItem> = {
    directionLabels: {
      next: 'next',
      previous: 'previous',
    },
    formatOtherItemNavigationHint(hintSpec) {
      return `[${hintSpec}]`;
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call injectListNavigationHints with correct arguments', () => {
    // act
    makeListNavigationHintPropsGenerator(mockItems, mockOptions);

    // assert
    expect(injectListNavigationHints).toHaveBeenCalledTimes(1);
    expect(injectListNavigationHints).toHaveBeenCalledWith(
      mockItems,
      mockOptions,
    );
  });

  it('should return a function that yields correct accessibilityHint values', () => {
    // arrange
    const mockHints = [{ hints: ['Hint 1'] }, { hints: ['Hint 2'] }];
    (injectListNavigationHints as jest.Mock).mockReturnValue(mockHints);

    const generatorFunction = makeListNavigationHintPropsGenerator(
      mockItems,
      mockOptions,
    );

    // act & assert
    expect(generatorFunction()).toEqual({ accessibilityHint: 'Hint 1' });
    expect(generatorFunction()).toEqual({ accessibilityHint: 'Hint 2' });
    // ensure there are no more hints
    expect(generatorFunction()).toBeUndefined();
  });

  it('should return a function that uses a custom hintsJoiner', () => {
    // arrange
    const mockHints = [
      { hints: ['Hint 1', 'Extra'] },
      { hints: ['Hint 2', 'Extra'] },
    ];
    (injectListNavigationHints as jest.Mock).mockReturnValue(mockHints);

    const customJoiner = (hints: string[]) => hints.join(', ');
    const generatorFunction = makeListNavigationHintPropsGenerator(
      mockItems,
      mockOptions,
      customJoiner,
    );

    // act & assert
    expect(generatorFunction()).toEqual({ accessibilityHint: 'Hint 1, Extra' });
    expect(generatorFunction()).toEqual({ accessibilityHint: 'Hint 2, Extra' });
    // ensure there are no more hints
    expect(generatorFunction()).toBeUndefined();
  });
});
