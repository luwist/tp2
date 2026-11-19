const ink = '#17171F';

const severityColors = (background: string) => ({
  background,
  borderColor: ink,
  color: ink,
  detailColor: '#3A3A46',
  shadow: `4px 4px 0 ${ink}`,
  closeButton: {
    hoverBackground: 'rgb(23 23 31 / 12%)',
    focusRing: {
      color: ink,
      shadow: 'none',
    },
  },
});

const toastColors = {
  blur: '0',
  info: severityColors('#D9CCFF'),
  success: severityColors('#B8F0D8'),
  warn: severityColors('#FFE08A'),
  error: severityColors('#FFB3BC'),
  secondary: severityColors('#F1EBD9'),
  contrast: severityColors('#FFFDF7'),
};

export const ToastPreset = {
  root: {
    width: '384px',
    borderRadius: '14px',
    borderWidth: '2px',
  },
  icon: {
    size: '20px',
  },
  content: {
    padding: '14px 16px',
    gap: '12px',
  },
  text: {
    gap: '4px',
  },
  summary: {
    fontSize: '15px',
    fontWeight: '800',
  },
  detail: {
    fontSize: '14px',
    fontWeight: '500',
  },
  closeButton: {
    width: '28px',
    height: '28px',
    borderRadius: '10px',
  },
  closeIcon: {
    size: '14px',
  },
  // La app tiene un solo tema: mismos colores en light y dark
  colorScheme: {
    light: toastColors,
    dark: toastColors,
  },
  css: () => `
    .p-toast-message {
      font-family: "Bricolage Grotesque", sans-serif;
    }

    .p-toast-message-content {
      align-items: flex-start;
    }

    .p-toast-close-button {
      flex-shrink: 0;
      border: 2px solid ${ink};
      background: #FFFDF7;
      color: ${ink};
    }

    .p-toast-close-button:hover {
      background: #FFF3CC;
    }
  `,
};
