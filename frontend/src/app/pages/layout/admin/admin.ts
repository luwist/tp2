import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';

@Component({
  imports: [RouterOutlet, FormsModule, RouterLink, SelectButtonModule],
  selector: 'app-admin',
  styleUrl: './admin.scss',
  templateUrl: './admin.html',
})
export class Admin {
  private readonly router = inject(Router);

  protected readonly sortBy = signal<any>('');

  protected readonly sortOptions = [
    { label: 'Usuarios', value: '' },
    { label: 'Dashboard', value: 'dashboard' },
  ];

  protected onSortChange(sort: any) {
    console.log(sort.value);
    if (sort.value == 'dashboard') {
      this.router.navigate(['admin', sort.value]);
    } else {
      this.router.navigate(['admin']);
    }
  }
}
