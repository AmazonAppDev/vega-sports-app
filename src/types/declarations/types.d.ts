// main use case for this type is to mark fields coming from API
type Maybe<T> = T | null | undefined;

// intention here is to have similar type to NonNullable embedded in TS
// to allow make property be `null`
type Nullable<T> = T | null;

// intention here is to have similar type to Nullable above
// to allow make property available in type but allows to be `undefined`
type MaybeUndefined<T> = T | undefined;

declare module '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons' {
  import type { ViewProps } from 'react-native';

  const Icon: React.FC<
    {
      name: string;
      size?: number;
      color?: string;
    } & Pick<ViewProps, 'style' | 'testID'>
  >;

  export default Icon;
}

declare module '@amazon-devices/react-native-vector-icons/MaterialIcons' {
  import type { ViewProps } from 'react-native';

  const Icon: React.FC<
    {
      name: string;
      size?: number;
      color?: string;
    } & Pick<ViewProps, 'style' | 'testID'>
  >;

  export default Icon;
}
