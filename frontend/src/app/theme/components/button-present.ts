const buttonColors = {
  primary: {
    background: '#7C5CFF',
    hoverBackground: '#6F4FF2',
    activeBackground: '#6445E0',
    color: '#FFFFFF',
    hoverColor: '#FFFFFF',
    activeColor: '#FFFFFF',
    borderColor: '#7C5CFF',
    hoverBorderColor: '#6F4FF2',
    activeBorderColor: '#6445E0',
    focusRing: {
      color: '#A99BFF',
      shadow: 'none',
    },
  },
  secondary: {
    background: '#1D202B',
    hoverBackground: '#262A38',
    activeBackground: '#2E3243',
    color: '#FFFFFF',
    hoverColor: '#FFFFFF',
    activeColor: '#FFFFFF',
    borderColor: '#1D202B',
    hoverBorderColor: '#262A38',
    activeBorderColor: '#2E3243',
    focusRing: {
      color: '#A99BFF',
      shadow: 'none',
    },
  },
  text: {
    primary: {
      hoverBackground: 'rgba(124, 92, 255, 0.12)',
      activeBackground: 'rgba(124, 92, 255, 0.20)',
      color: '#7C5CFF',
    },
    secondary: {
      hoverBackground: 'rgba(255, 255, 255, 0.06)',
      activeBackground: 'rgba(255, 255, 255, 0.10)',
      color: '#E5E7EB',
    },
  },
};

export const ButtonPreset = {
  root: {
    borderRadius: '12px',
    paddingX: '24px',
    paddingY: '13px',
    gap: '8px',
    transitionDuration: '0.2s',
    label: {
      fontWeight: '600',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      offset: '2px',
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
  colorScheme: {
    dark: { root: buttonColors },
  },
  css: () => `
    .p-button {
      // height: 48px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      text-decoration: none;
    }

    // .p-button.p-button-sm {
    //   height: 28px;
    // }

    // .p-button.p-button-lg {
    //   height: 56px;
    // }

    /* Botones solo ícono: cuadrados, del alto de cada tamaño */
    .p-button.p-button-icon-only {
      width: 48px;
      height: 48px;
      padding: 0;
    }

    // .p-button.p-button-icon-only.p-button-sm {
    //   width: 28px;
    // }

    // .p-button.p-button-icon-only.p-button-lg {
    //   width: 56px;
    // }
  `,
};
