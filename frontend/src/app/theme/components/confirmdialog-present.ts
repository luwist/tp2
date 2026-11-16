export const ConfirmDialogPreset = {
  // Tokens que expone PrimeNG para confirmdialog
  icon: {
    size: '110px',
  },
  content: {
    gap: '24px',
  },

  // Todo lo demás se pisa con las clases nativas de PrimeNG
  css: () => `
    /* ---------- Contenedor: grilla [mascota | título + mensaje] ---------- */
    .p-confirmdialog.p-dialog {
      display: grid !important; /* PrimeNG pone display:flex inline */
      grid-template-columns: 110px 1fr;
      column-gap: 24px;
      position: relative;
      width: 640px;
      max-width: calc(100vw - 32px);
      padding: 32px;
      background: #FFFDF7;
      color: #17171F;
      border: 2px solid #17171F;
      border-radius: 28px;
      box-shadow: 6px 6px 0 #17171F;
      overflow: visible;
      font-family: "Bricolage Grotesque", sans-serif;
    }

    /* ---------- Etiqueta "Ojo con esto" (bordes dentados) ---------- */
    .p-confirmdialog.p-dialog::before {
      content: 'Ojo con esto';
      position: absolute;
      top: -14px;
      left: 24px;
      padding: 9px 20px;
      background: #FF6B35;
      color: #17171F;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transform: rotate(-3deg);
      clip-path: polygon(
        0% 14%, 5% 0%, 10% 14%, 15% 0%, 20% 14%, 25% 0%, 30% 14%, 35% 0%, 40% 14%, 45% 0%,
        50% 14%, 55% 0%, 60% 14%, 65% 0%, 70% 14%, 75% 0%, 80% 14%, 85% 0%, 90% 14%, 95% 0%, 100% 14%,
        100% 86%, 95% 100%, 90% 86%, 85% 100%, 80% 86%, 75% 100%, 70% 86%, 65% 100%, 60% 86%, 55% 100%,
        50% 86%, 45% 100%, 40% 86%, 35% 100%, 30% 86%, 25% 100%, 20% 86%, 15% 100%, 10% 86%, 5% 100%, 0% 86%
      );
    }

    /* ---------- Header (título + cerrar) ---------- */
    .p-confirmdialog .p-dialog-header {
      grid-column: 2;
      grid-row: 1;
      padding: 0 56px 0 0;
      background: transparent;
      border: 0;
    }

    .p-confirmdialog .p-dialog-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.15;
    }

    .p-confirmdialog .p-dialog-header-actions {
      position: absolute;
      top: 24px;
      right: 24px;
    }

    .p-confirmdialog .p-dialog-close-button {
      width: 44px;
      height: 44px;
      background: #FFFDF7 !important;
      border: 2px solid #17171F !important;
      border-radius: 50% !important;
      color: #17171F !important;
    }

    .p-confirmdialog .p-dialog-close-button:hover {
      background: #FFEFBF !important;
    }

    /* ---------- Content: el ícono pasa a ser la mascota ---------- */
    .p-confirmdialog .p-dialog-content {
      display: contents; /* ícono y mensaje se acomodan en la grilla del dialog */
    }

    .p-confirmdialog .p-confirmdialog-icon {
      grid-column: 1;
      grid-row: 1 / span 2;
      align-self: center;
      display: block;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 130' fill='none'%3E%3Cg transform='translate(6 6)' fill='%2317171F'%3E%3Crect x='10' y='26' width='94' height='22' rx='11'/%3E%3Cpath d='M18 46H96L89 115Q88 122 80 122H34Q26 122 25 115Z'/%3E%3C/g%3E%3Crect x='44' y='12' width='26' height='16' rx='6' fill='%23FFC531' stroke='%2317171F' stroke-width='4'/%3E%3Cpath d='M18 46H96L89 115Q88 122 80 122H34Q26 122 25 115Z' fill='%23FF7EB6' stroke='%2317171F' stroke-width='4' stroke-linejoin='round'/%3E%3Crect x='10' y='26' width='94' height='22' rx='11' fill='%23FFC531' stroke='%2317171F' stroke-width='4'/%3E%3Ccircle cx='42' cy='78' r='9' fill='white' stroke='%2317171F' stroke-width='3'/%3E%3Ccircle cx='72' cy='78' r='9' fill='white' stroke='%2317171F' stroke-width='3'/%3E%3Ccircle cx='43' cy='80' r='4' fill='%2317171F'/%3E%3Ccircle cx='71' cy='80' r='4' fill='%2317171F'/%3E%3Cpath d='M30 64L50 72M84 64L64 72' stroke='%2317171F' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M45 102Q57 92 69 102' stroke='%2317171F' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
    }

    /* Oculta el glifo original del ícono */
    .p-confirmdialog .p-confirmdialog-icon::before {
      content: none;
    }

    .p-confirmdialog .p-confirmdialog-message {
      grid-column: 2;
      grid-row: 2;
      margin-top: 12px;
      font-size: 15px;
      line-height: 1.4;
      color: #3A3A44;
    }

    .p-confirmdialog .p-confirmdialog-message strong {
      color: #17171F;
    }

    /* ---------- Footer: botones ---------- */
    .p-confirmdialog .p-dialog-footer {
      grid-column: 1 / -1;
      grid-row: 3;
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding: 0;
    }

    .p-confirmdialog .p-confirmdialog-reject-button,
    .p-confirmdialog .p-confirmdialog-accept-button {
      height: 52px;
      padding: 0 24px;
      border: 2px solid #17171F !important;
      border-radius: 14px;
      color: #17171F !important;
      font-family: inherit;
      font-size: 15px;
      font-weight: 800;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }

    .p-confirmdialog .p-confirmdialog-reject-button {
      background: #FFFDF7 !important;
      box-shadow: 3px 3px 0 #17171F;
    }

    .p-confirmdialog .p-confirmdialog-accept-button {
      background: #FF6B35 !important;
      box-shadow: 4px 4px 0 #17171F;
    }

    .p-confirmdialog .p-confirmdialog-reject-button:hover,
    .p-confirmdialog .p-confirmdialog-accept-button:hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0 #17171F;
    }

    .p-confirmdialog .p-confirmdialog-reject-button:active,
    .p-confirmdialog .p-confirmdialog-accept-button:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 #17171F;
    }

    /* ---------- Mobile ---------- */
    @media (max-width: 600px) {
      .p-confirmdialog.p-dialog {
        grid-template-columns: 1fr;
        padding: 28px 20px 24px;
      }

      .p-confirmdialog .p-confirmdialog-icon {
        grid-column: 1;
        grid-row: 1;
        justify-self: center;
        margin-bottom: 12px;
      }

      .p-confirmdialog .p-dialog-header {
        grid-column: 1;
        grid-row: 2;
        padding-right: 0;
        text-align: center;
      }

      .p-confirmdialog .p-dialog-title {
        font-size: 26px;
      }

      .p-confirmdialog .p-confirmdialog-message {
        grid-column: 1;
        grid-row: 3;
        text-align: center;
      }

      .p-confirmdialog .p-dialog-footer {
        grid-row: 4;
        flex-direction: column-reverse;
      }
    }
  `,
};
