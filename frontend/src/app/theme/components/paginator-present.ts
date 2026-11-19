const ink = '#17171F';
const accent = '#FFC531';

export const PaginatorPreset = {
  root: {
    padding: '12px 16px',
    gap: '8px',
    borderRadius: '0',
    background: '#FFFDF7',
    color: ink,
    transitionDuration: '0.15s',
  },
  navButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#FFFFFF',
    hoverBackground: '#FFF3CC',
    selectedBackground: accent,
    color: ink,
    hoverColor: ink,
    selectedColor: ink,
    focusRing: {
      width: '0',
      style: 'none',
      color: 'transparent',
      offset: '0',
      shadow: `3px 3px 0 ${accent}`, // misma sombra amarilla que el input
    },
  },
  currentPageReport: {
    color: '#5B5B66',
  },
  // Los tokens están a nivel root: se aplican igual en light y dark
  css: () => `
    .p-paginator {
      border-top: 2px solid ${ink};
      font-family: "Bricolage Grotesque", sans-serif;
    }

    .p-paginator-first,
    .p-paginator-prev,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-page {
      border: 2px solid ${ink};
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
    }

    .p-paginator-page-selected,
    .p-paginator-page.p-highlight {
      background: ${accent};
      box-shadow: 2px 2px 0 ${ink};
    }

    .p-paginator-first:not(:disabled):active,
    .p-paginator-prev:not(:disabled):active,
    .p-paginator-next:not(:disabled):active,
    .p-paginator-last:not(:disabled):active,
    .p-paginator-page:not(.p-paginator-page-selected):active {
      transform: translate(1px, 1px);
    }

    .p-paginator-first:disabled,
    .p-paginator-prev:disabled,
    .p-paginator-next:disabled,
    .p-paginator-last:disabled {
      border-color: #8A8A94;
      color: #8A8A94;
      opacity: 0.6;
    }
  `,
};
