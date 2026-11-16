export const PopoverPreset = {
  root: {
    background: '#FFFDF7',
    borderColor: '#17171F',
    color: '#17171F',
    borderRadius: '16px',
    shadow: '4px 4px 0 #17171F',
    gutter: '12px', // separación entre el trigger y el popover
    arrowOffset: '1.25rem',
  },
  content: {
    padding: '8px',
  },
  css: () => `
    .p-popover {
      border-width: 2px;
      font-family: "Bricolage Grotesque", sans-serif;
    }

    /* Flecha: el triángulo de atrás (contorno) es 3px más grande que el de adelante (relleno) */
    .p-popover::after {
      border-width: 10px;
      margin-left: -10px;
    }

    .p-popover::before {
      border-width: 13px;
      margin-left: -13px;
    }
  `,
};
