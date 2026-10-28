export const ButtonPreset = {
  colorScheme: {
    dark: {
      root: {
        height: '48px',
        paddingX: '24px',
        paddingY: '17px',
        borderRadius: '12px',
        label: {
          fontWeight: '600',
        },
        primary: {
          background: '#7C5CFF',
          hoverBackground: '#7556f1',
          activeBackground: '#7556f1',
          color: '#FFFFFF',
          borderColor: '#7C5CFF',
          hoverBorderColor: '#7556f1',
          activeBorderColor: '#7556f1',
          hoverColor: '#FFFFFF',
        },
        secondary: {
          background: '#2F2F37',
          hoverBackground: '#40404b',
          activeBackground: '#40404b',
          color: '#FFFFFF',
          borderColor: '#4A4A56',
          hoverBorderColor: '#40404b',
          activeBorderColor: '#40404b',
          hoverColor: '#FFFFFF',
        },
      },
    },
  },
  css: () => `
    .p-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      text-decoration: none;
    }
  `,
};
