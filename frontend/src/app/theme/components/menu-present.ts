export const MenuPreset = {
  root: {
    background: '#FFFDF7',
    borderColor: '#17171F',
    borderRadius: '16px',
    color: '#17171F',
    shadow: '4px 4px 0 #17171F',
  },
  list: {
    padding: '8px',
    gap: '4px',
  },
  item: {
    focusBackground: '#FFEFBF',
    color: '#17171F',
    focusColor: '#17171F',
    borderRadius: '10px',
    padding: '8px',
    gap: '12px',
  },
  css: () => `
    .p-menu.p-menu-overlay {
      border: 2px solid #17171F;
      box-shadow: 4px 4px 0 #17171F;
      overflow: visible;
      font-family: "Bricolage Grotesque", sans-serif;
      margin-top: 10px;
    }

    .p-menu.p-menu-overlay::before {
      content: '';
      position: absolute;
      top: -9px;
      right: 14px;
      width: 14px;
      height: 14px;
      background: #FFFDF7;
      border-left: 2px solid #17171F;
      border-top: 2px solid #17171F;
      border-top-left-radius: 3px;
      transform: rotate(45deg);
      z-index: 1;
    }

    .p-menu .p-menu-list {
      position: relative;
      z-index: 2;
    }

    .p-menu .p-menu-item-content {
      border-radius: 10px;
      transition: background 0.15s ease;
    }

    .p-menu .p-menu-item-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px 8px 8px;
      color: #17171F;
      text-decoration: none;
    }

    .p-menu .p-menu-item-label {
      font-size: 14px;
      font-weight: 800;
      white-space: nowrap;
    }

    .p-menu .p-menu-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      font-size: 16px;
      color: #17171F;
      background: #FF7EB6;
      border: 2px solid #17171F;
      border-radius: 10px;
      margin: 0;
    }

    .p-menu .p-menu-item:not(.p-disabled) > .p-menu-item-content:hover,
    .p-menu .p-menu-item.p-focus > .p-menu-item-content {
      background: #FFEFBF;
      color: #17171F;
    }

    .p-menu .p-menu-item-link:focus-visible {
      outline: 2px solid #17171F;
      outline-offset: -2px;
    }
  `,
};
