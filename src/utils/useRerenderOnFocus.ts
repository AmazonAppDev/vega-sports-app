import { useCallback, useState } from 'react';

import { useFocusEffect } from '@amazon-devices/react-navigation__core';

export const useRerenderOnFocus = () => {
  const [shouldRender, setShouldRender] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setShouldRender(true);

      return () => setShouldRender(false);
    }, []),
  );

  return shouldRender;
};
