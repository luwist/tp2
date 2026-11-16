const ink = '#17171F';
const cream = '#FFFDF7';

const buttonColors = {
  // Acento principal de la app (amarillo)
  primary: {
    background: '#FFC531',
    hoverBackground: '#FFD24D',
    activeBackground: '#F2B400',
    color: ink,
    hoverColor: ink,
    activeColor: ink,
    borderColor: ink,
    hoverBorderColor: ink,
    activeBorderColor: ink,
    focusRing: { color: ink, shadow: 'none' },
  },
  // Crema con borde (ej: "Cancelar")
  secondary: {
    background: cream,
    hoverBackground: '#FFEFBF',
    activeBackground: '#FFE59A',
    color: ink,
    hoverColor: ink,
    activeColor: ink,
    borderColor: ink,
    hoverBorderColor: ink,
    activeBorderColor: ink,
    focusRing: { color: ink, shadow: 'none' },
  },
  // Acciones destructivas (ej: "Sí, eliminar")
  danger: {
    background: '#FF6B35',
    hoverBackground: '#FF7F50',
    activeBackground: '#F2561F',
    color: ink,
    hoverColor: ink,
    activeColor: ink,
    borderColor: ink,
    hoverBorderColor: ink,
    activeBorderColor: ink,
    focusRing: { color: ink, shadow: 'none' },
  },
  // Oscuro, para cuando quieras un botón con más peso
  contrast: {
    background: ink,
    hoverBackground: '#2A2A36',
    activeBackground: '#363645',
    color: cream,
    hoverColor: cream,
    activeColor: cream,
    borderColor: ink,
    hoverBorderColor: ink,
    activeBorderColor: ink,
    focusRing: { color: ink, shadow: 'none' },
  },
  text: {
    primary: {
      hoverBackground: 'rgba(255, 197, 49, 0.25)',
      activeBackground: 'rgba(255, 197, 49, 0.40)',
      color: ink,
    },
    secondary: {
      hoverBackground: '#FFEFBF',
      activeBackground: '#FFE59A',
      color: ink,
    },
  },
};

// Botones "sólidos": todos menos text, link y outlined
const solid = '.p-button:not(.p-button-text):not(.p-button-link):not(.p-button-outlined)';

export const ButtonPreset = {
  root: {
    borderRadius: '12px',
    paddingX: '24px',
    paddingY: '0', // el alto se define en css
    gap: '8px',
    transitionDuration: '0.15s',
    label: {
      fontWeight: '800',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      offset: '3px',
    },
    sm: {
      fontSize: '14px',
      paddingX: '24px',
      paddingY: '0',
    },
    lg: {
      fontSize: '14px',
      paddingX: '24px',
      paddingY: '0',
    },
  },
  // La app tiene un solo tema, así que los mismos colores van en light y dark
  colorScheme: {
    light: { root: buttonColors },
    dark: { root: buttonColors },
  },
  css: () => `
    .p-button {
      height: 48px;
      border-width: 2px;
      font-family: "Bricolage Grotesque", sans-serif;
      font-size: 14px;
      font-weight: 800;
      line-height: 20px;
      text-decoration: none;
      transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
    }

    .p-button.p-button-sm {
      height: 36px;
    }

    .p-button.p-button-lg {
      height: 56px;
    }

    /* Botones solo ícono: cuadrados, del alto de cada tamaño */
    .p-button.p-button-icon-only {
      width: 48px;
      height: 48px;
      padding: 0;
    }

    .p-button.p-button-icon-only.p-button-sm {
      width: 36px;
      height: 36px;
    }

    .p-button.p-button-icon-only.p-button-lg {
      width: 56px;
      height: 56px;
    }

    /* Sombra dura: se "hunde" al apoyar el mouse y al hacer click */
    ${solid} {
      box-shadow: 3px 3px 0 ${ink};
    }

    ${solid}:not(:disabled):hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0 ${ink};
    }

    ${solid}:not(:disabled):active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 ${ink};
    }

    .p-button:disabled {
      box-shadow: none;
      opacity: 0.5;
    }
  `,
};
