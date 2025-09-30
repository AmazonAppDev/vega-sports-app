import React from 'react';

/**
 * forwardRef wrapper that supports generic components
 * @param component the component
 * @returns the wrapped component with forwarded ref
 */
export function genericForwardRef<RefType, Properties = {}>(
  component: (props: Properties, ref: React.Ref<RefType>) => React.ReactNode,
): (props: Properties & React.RefAttributes<RefType>) => React.ReactNode {
  // @ts-expect-error
  return React.forwardRef(component);
}
