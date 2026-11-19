const ink = '#17171F';
const accent = '#FFC531';

const toggleSwitchColors = {
  background: '#FFFDF7',
  hoverBackground: '#FFF3CC',
  checkedBackground: accent,
  checkedHoverBackground: '#FFB800',
  disabledBackground: '#F1EBD9',
};

const toggleSwitchHandleColors = {
  background: ink,
  hoverBackground: ink,
  checkedBackground: ink,
  checkedHoverBackground: ink,
  disabledBackground: '#8A8A94',
  color: ink,
  hoverColor: ink,
  checkedColor: ink,
  checkedHoverColor: ink,
};

export const ToggleSwitchPreset = {
  root: {
    width: '48px',
    height: '28px',
    borderRadius: '999px',
    gap: '4px',
    borderWidth: '2px',
    borderColor: ink,
    hoverBorderColor: ink,
    checkedBorderColor: ink,
    checkedHoverBorderColor: ink,
    shadow: `2px 2px 0 ${ink}`,
    focusRing: {
      width: '0',
      style: 'none',
      color: 'transparent',
      offset: '0',
      shadow: `3px 3px 0 ${accent}`, // misma sombra amarilla que el input
    },
    transitionDuration: '0.15s',
    slideDuration: '0.15s',
  },
  handle: {
    borderRadius: '50%',
    size: '16px',
  },
  // La app tiene un solo tema: mismos colores en light y dark
  colorScheme: {
    light: { root: toggleSwitchColors, handle: toggleSwitchHandleColors },
    dark: { root: toggleSwitchColors, handle: toggleSwitchHandleColors },
  },
  css: () => `
    .p-toggleswitch-slider {
      transition: background 0.15s ease, box-shadow 0.15s ease;
    }

    .p-toggleswitch:not(.p-disabled):active .p-toggleswitch-slider {
      box-shadow: 0 0 0 ${ink};
      transform: translate(2px, 2px);
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
      border-color: #8A8A94;
      box-shadow: none;
    }
  `,
};
