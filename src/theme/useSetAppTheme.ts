import { useSetTheme } from '@amazon-devices/kepler-ui-components';

import type { InternalKeplerTheme } from '@AppTheme/types';

export const useSetAppTheme = () => useSetTheme<InternalKeplerTheme>();
