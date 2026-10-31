import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@app/components';
import { SplashScreen } from '@app/components/ui';
import { AuthService } from '@app/services';

@Component({
  imports: [RouterOutlet, Header, SplashScreen],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly auth = inject(AuthService);
}
