import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 150): string {
    const text = value ?? '';
    if (text.length <= limit) return text;

    const cut = text.slice(0, limit + 1);
    const lastSpace = cut.lastIndexOf(' ');
    const end = lastSpace > 0 ? lastSpace : limit;

    return `${text.slice(0, end).trimEnd()}…`;
  }
}
