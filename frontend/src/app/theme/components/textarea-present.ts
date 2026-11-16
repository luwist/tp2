const textareaColors = {
  background: '#FFFDF7',
  disabledBackground: '#F1EBD9',
  filledBackground: '#FFFDF7',
  filledHoverBackground: '#FFFDF7',
  filledFocusBackground: '#FFFDF7',
  borderColor: '#17171F',
  hoverBorderColor: '#17171F',
  focusBorderColor: '#17171F',
  invalidBorderColor: '#D6293E',
  color: '#17171F',
  disabledColor: '#8A8A94',
  placeholderColor: '#9A9AA5',
  invalidPlaceholderColor: '#D6293E',
};

export const TextareaPreset = {
  root: {
    borderRadius: '12px',
    paddingX: '16px',
    paddingY: '14px',
    shadow: 'none',
    focusRing: {
      width: '0',
      style: 'none',
      color: 'transparent',
      offset: '0',
      shadow: '3px 3px 0 #FFC531',
    },
  },
  // Un solo tema: mismos colores en light y dark (igual que inputtext y button)
  colorScheme: {
    light: { root: textareaColors },
    dark: { root: textareaColors },
  },
  css: () => `
    .p-textarea {
      width: 100%;
      min-height: 144px;
      max-height: 240px;
      border-width: 2px;
      font-family: "Bricolage Grotesque", sans-serif;
      font-size: 14px;
      line-height: 20px;
      transition: box-shadow 0.15s ease;
    }

    .p-textarea:enabled:focus {
      outline: 0;
      box-shadow: 3px 3px 0 #FFC531;
    }

    .p-textarea.ng-invalid.ng-touched:enabled:focus {
      box-shadow: 3px 3px 0 #FFB3BC;
    }
  `,
};
