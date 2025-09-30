import type { ReactElement } from 'react';
import React from 'react';

import type { FocusGuideProps } from '@amazon-devices/react-native-kepler';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';

export type FocusGuideViewProps = FocusGuideProps & {
  children: ReactElement | ReactElement[];
};

export const FocusGuideView = ({ children, ...props }: FocusGuideViewProps) => {
  return <TVFocusGuideView {...props}>{children}</TVFocusGuideView>;
};
