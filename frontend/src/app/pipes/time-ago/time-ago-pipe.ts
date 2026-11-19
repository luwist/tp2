import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });

  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

    // Tolerancia por ligeros desfases de reloj entre cliente y servidor
    if (diffInSeconds < 30) {
      return 'Recién';
    }

    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
    ];

    // Si pasaron 7 días o más, muestra la fecha corta (ej: 16/11/2026)
    if (diffInSeconds >= 7 * 86400) {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    }

    for (const { unit, seconds } of units) {
      if (diffInSeconds >= seconds) {
        const count = Math.floor(diffInSeconds / seconds);
        return this.capitalize(this.rtf.format(-count, unit));
      }
    }

    return 'Recién';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
