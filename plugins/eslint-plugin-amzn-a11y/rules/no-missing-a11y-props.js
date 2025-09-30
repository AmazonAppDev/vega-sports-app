const interactiveComponents = [
  // note: Button & IconButton do not need enforcement as they already define a 'role="button"' prop by default
  'TouchableOpacity',
  'SeekBar',
  'FocusStyleTouchableOpacity',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback',
  'TouchableOpacity',
  'TouchableHighlight',
  'TextInput',
  'Pressable',
  'Switch',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that interactive components have proper a11y properties.',
    },
    messages: {
      missingA11yProp:
        "Missing required a11y props for interactive component. Expected to find 'role' or 'aria-label'.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (interactiveComponents.includes(node.name.name)) {
          const jsxAttributes = node.attributes.filter(
            ({ type }) => type === 'JSXAttribute',
          );

          const isInteractivityDisabled = jsxAttributes.find(
            (attribute) =>
              attribute.name.name === 'accessible' &&
              attribute.value?.type === 'JSXExpressionContainer' &&
              attribute.value.expression.type === 'Literal' &&
              attribute.value.expression.value === false,
          );

          if (!isInteractivityDisabled) {
            const anyA11yRequiredPropPresent = jsxAttributes.some((attribute) =>
              [
                'role',
                'aria-label',
                'accessibilityRole',
                'accessibilityLabel',
              ].includes(attribute.name.name),
            );

            if (!anyA11yRequiredPropPresent) {
              context.report({
                node,
                messageId: 'missingA11yProp',
              });
            }
          }
        }
      },
    };
  },
};
