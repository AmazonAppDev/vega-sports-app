const a11yReplacementPropsLUT = {
  accessibilityLabel: 'aria-label',
  accessibilityLabelledBy: 'aria-labelledby',
  accessibilityLiveRegion: 'aria-live',
  accessibilityRole: 'role',
  accessibilityState: ['aria-checked', 'aria-disabled', 'aria-expanded'],
  accessibilityValue: [
    'aria-valuemin',
    'aria-valuemax',
    'aria-valuenow',
    'aria-valuetext',
  ],
  accessibilityElementsHidden: 'aria-hidden',
  accessibilityViewIsModal: 'aria-modal',
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that inferior a11y rules are replaced with the ones that are equivalent but have precedence over them.',
    },
    fixable: 'code',
    schema: [],
    hasSuggestions: true,
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const propName = node.name.name;

        if (a11yReplacementPropsLUT[propName]) {
          const deprecated = propName,
            preferred = a11yReplacementPropsLUT[deprecated];

          const suggestions = (
            Array.isArray(preferred) ? preferred : [preferred]
          ).map((p) => ({
            desc: `Replace property with '${p}'`,
            fix: (fixer) => {
              return fixer.replaceText(node.name, p);
            },
          }));

          context.report({
            node,
            message: Array.isArray(preferred)
              ? `Prop '${deprecated}' is inferior. Use ${preferred.map((p) => `'${p}'`).join(', ')} instead, which has precedence.`
              : `Prop '${deprecated}' is inferior. Use '${preferred}' instead, which has precedence.`,
            suggest: suggestions,
            // if only one suggestion is available, then the issue is auto-fixable
            fix: suggestions.length === 1 ? suggestions[0].fix : undefined,
          });
        }
      },
    };
  },
};
