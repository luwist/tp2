const ink = '#17171F';
const accent = '#FFC531';

const radioColors = {
  background: '#FFFDF7',
  checkedBackground: accent,
  checkedHoverBackground: '#FFB800',
  disabledBackground: '#F1EBD9',
  filledBackground: '#FFFDF7',
  borderColor: ink,
  hoverBorderColor: ink,
  focusBorderColor: ink,
  checkedBorderColor: ink,
  checkedHoverBorderColor: ink,
  checkedFocusBorderColor: ink,
  checkedDisabledBorderColor: '#8A8A94',
  invalidBorderColor: '#D6293E',
};

const radioIconColors = {
  checkedColor: ink,
  checkedHoverColor: ink,
  disabledColor: '#8A8A94',
};

export const RadioButtonPreset = {
  root: {
    width: '22px',
    height: '22px',
    shadow: 'none',
    transitionDuration: '0.15s',
    focusRing: {
      width: '0',
      style: 'none',
      color: 'transparent',
      offset: '0',
      shadow: `3px 3px 0 ${accent}`, // misma sombra amarilla que el input
    },
  },
  icon: {
    size: '10px',
  },
  // La app tiene un solo tema: mismos colores en light y dark
  colorScheme: {
    light: { root: radioColors, icon: radioIconColors },
    dark: { root: radioColors, icon: radioIconColors },
  },
  // Valores explícitos para que el diseño no dependa del esquema claro/oscuro del navegador
  css: () => `
    .p-radiobutton-box {
      border: 2px solid ${ink};
      background: #FFFDF7;
      box-shadow: none;
      transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
    }

    .p-radiobutton:not(.p-disabled):hover .p-radiobutton-box {
      background: #FFF3CC;
    }

    .p-radiobutton-checked .p-radiobutton-box,
    .p-radiobutton-checked:not(.p-disabled):hover .p-radiobutton-box {
      background: ${accent};
      border-color: ${ink};
      box-shadow: 2px 2px 0 ${ink};
    }

    .p-radiobutton-checked .p-radiobutton-icon {
      background: ${ink};
    }

    .p-radiobutton-input:focus-visible + .p-radiobutton-box {
      outline: 0;
      box-shadow: 3px 3px 0 ${accent};
    }

    .p-radiobutton-checked .p-radiobutton-input:focus-visible + .p-radiobutton-box {
      box-shadow: 3px 3px 0 ${ink};
    }

    .p-radiobutton.p-disabled .p-radiobutton-box {
      background: #F1EBD9;
      border-color: #8A8A94;
      box-shadow: none;
    }

    .p-radiobutton.p-disabled .p-radiobutton-icon {
      background: #8A8A94;
    }
  `,
};
