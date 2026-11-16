export const SelectButtonPreset = {
  colorScheme: {
    dark: {
      root: {
        invalidBorderColor: '#FE1D3B',
      },
    },
  },
  root: {
    borderRadius: '12px',
  },
  css: () => `
    .p-selectbutton {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    background: #FFFDF7;
    border: 2px solid #17171F;
    padding: 4px;
    height: 56px;
    gap: 4px;
  }

  .p-selectbutton .p-togglebutton {
    background: #FFFDF7;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    color: #17171F;
    font-weight: 800;
    border-radius: 8px;
  }

  .p-selectbutton .p-togglebutton-content {
    width: 100%;
    height: 100%;
    padding: 0 16px;
    justify-content: center;
    border-radius: 8px;
    background: transparent;
  }

  .p-selectbutton .p-togglebutton-label {
    white-space: nowrap;
    font-size: 14px;
  }

.p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
  background: #FFEFBF !important;
  color: #17171F !important;
}

  .p-togglebutton.p-togglebutton-checked .p-togglebutton-content {
    background: #FFC531;
    color: #17171F;
    border-color: transparent;
  }
  `,
};
