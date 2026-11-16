const ink = '#17171F';

const inputColors = {
  background: '#FFFDF7',
  disabledBackground: '#F1EBD9',
  filledBackground: '#FFFDF7',
  filledHoverBackground: '#FFFDF7',
  filledFocusBackground: '#FFFDF7',
  borderColor: ink,
  hoverBorderColor: ink,
  focusBorderColor: ink,
  invalidBorderColor: '#D6293E',
  color: ink,
  disabledColor: '#8A8A94',
  placeholderColor: '#9A9AA5',
  invalidPlaceholderColor: '#D6293E',
};

export const InputTextPreset = {
  root: {
    borderRadius: '12px',
    paddingX: '16px',
    paddingY: '0', // el alto se define en css
    shadow: 'none',
    focusRing: {
      width: '0',
      style: 'none',
      color: 'transparent',
      offset: '0',
      shadow: '3px 3px 0 #FFC531', // sombra amarilla al enfocar
    },
  },
  // La app tiene un solo tema: mismos colores en light y dark
  colorScheme: {
    light: { root: inputColors },
    dark: { root: inputColors },
  },
  css: () => `
    .p-inputtext {
      width: 100%;
      height: 48px;
      border-width: 2px;
      font-family: "Bricolage Grotesque", sans-serif;
      font-size: 14px;
      transition: box-shadow 0.15s ease, background 0.15s ease;
    }

    .p-inputtext:enabled:focus {
      outline: 0;
      box-shadow: 3px 3px 0 #FFC531;
    }

    .p-inputtext.ng-invalid.ng-touched:enabled:focus {
      box-shadow: 3px 3px 0 #FFB3BC;
    }

    /* Autocompletado del navegador: evita el fondo azul/oscuro */
    .p-inputtext:-webkit-autofill {
      -webkit-text-fill-color: ${ink};
      box-shadow: 0 0 0 100px #FFFDF7 inset;
    }
  `,
};
