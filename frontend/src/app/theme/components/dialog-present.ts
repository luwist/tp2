const ink = '#17171F';

const dialogColors = {
  background: '#FFFDF7',
  borderColor: ink,
  color: ink,
};

export const DialogPreset = {
  root: {
    borderRadius: '20px',
    shadow: `6px 6px 0 ${ink}`,
  },
  header: {
    padding: '20px 24px 12px',
    gap: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
  },
  content: {
    padding: '0 24px 24px',
  },
  footer: {
    padding: '0 24px 24px',
    gap: '12px',
  },
  // La app tiene un solo tema: mismos colores en light y dark
  colorScheme: {
    light: { root: dialogColors },
    dark: { root: dialogColors },
  },
  css: () => `
    .p-dialog {
      border-width: 2px;
      font-family: "Bricolage Grotesque", sans-serif;
    }

    .p-dialog-title {
      font-family: inherit;
    }

    .p-dialog-mask.p-overlay-mask {
      background: rgb(23 23 31 / 45%);
    }

    .p-dialog-close-button {
      width: 2rem;
      height: 2rem;
      border: 2px solid ${ink};
      border-radius: 10px;
      color: ${ink};
    }
  `,
};
