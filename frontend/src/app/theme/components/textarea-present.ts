export const TextareaPreset = {
  root: {
    background: 'transparent',
    borderColor: '#232734',
    borderRadius: '12px',
    color: '#FFFFFF',
    placeholderColor: '#FFFFFF',
    paddingX: '16px',
    paddingY: '18px',
    invalidBorderColor: '#FE1D3B',
    focusBorderColor: '#7C5CFF',
    hoverBorderColor: '#7C5CFF',
  },
  css: () => `
    .p-textarea {
      font-size: 14px;
      line-height: 20px;
      min-height: 144px;

      max-height: 240px;
    }
  `,
};
