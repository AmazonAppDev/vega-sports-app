import { act, renderHook } from '@testing-library/react-native';

import { useFocusState } from '../useFocusState';

describe('useFocusState()', () => {
  it('should return default state', () => {
    const { result } = renderHook(useFocusState);

    expect(result.current.isFocused).toBeFalsy();
  });

  it('should return passed initial state', () => {
    const { result } = renderHook(() => useFocusState({ initialState: true }));

    expect(result.current.isFocused).toBeTruthy();
  });

  it('should modify state state', async () => {
    const { result } = renderHook(useFocusState);

    await act(() => {
      result.current.handleFocus();
    });

    expect(result.current.isFocused).toBeTruthy();

    await act(() => {
      result.current.handleBlur();
    });

    expect(result.current.isFocused).toBeFalsy();
  });

  it('should call passed functions', async () => {
    const handleFocusMock = jest.fn();
    const handleBlurMock = jest.fn();

    const { result } = renderHook(() =>
      useFocusState({ onFocus: handleFocusMock, onBlur: handleBlurMock }),
    );

    await act(() => {
      result.current.handleFocus();
    });

    expect(handleFocusMock).toHaveBeenCalled();

    await act(() => {
      result.current.handleBlur();
    });

    expect(handleBlurMock).toHaveBeenCalled();
  });
});
