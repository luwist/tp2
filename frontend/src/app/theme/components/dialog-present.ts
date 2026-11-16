export const DialogPresent = {
  css: () => `
    /* ---------- Contenedor ---------- */
  .p-dialog.post-dialog {
    position: relative;
    max-width: calc(100vw - 32px);
    background: #FFFDF7;
    color: #17171F;
    border: 2px solid #17171F;
    border-radius: 28px;
    box-shadow: 6px 6px 0 #17171F;
    overflow: visible;
    font-family: "Bricolage Grotesque", sans-serif;
  }

  /* ---------- Etiqueta "Nueva publicación" (bordes dentados) ---------- */
  .p-dialog.post-dialog::before {
    content: 'Nueva publicación';
    position: absolute;
    top: -14px;
    left: 24px;
    z-index: 1;
    padding: 9px 20px;
    background: #FFC531;
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

  /* ---------- Header / content / footer ---------- */
  .p-dialog.post-dialog .p-dialog-header {
    padding: 32px 28px 8px;
    background: transparent;
    border: 0;
  }

  .p-dialog.post-dialog .p-dialog-content {
    padding: 8px 28px 0;
    background: transparent;
    scrollbar-width: thin;
    scrollbar-color: #17171F transparent;
  }

  .p-dialog.post-dialog .p-dialog-footer {
    padding: 16px 28px 28px;
    background: transparent;
    border: 0;
  }

  /* ---------- Botón cerrar ---------- */
  .p-dialog.post-dialog .p-dialog-close-button {
    width: 44px;
    height: 44px;
    background: #FFFDF7 !important;
    border: 2px solid #17171F !important;
    border-radius: 50% !important;
    color: #17171F !important;
    box-shadow: none !important;
  }

  .p-dialog.post-dialog .p-dialog-close-button:hover {
    background: #FFEFBF !important;
  }
  `,
};
