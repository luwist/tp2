import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Aura from '@openng/optimus-ui-themes/aura';
import { SplashScreen } from './components/ui';
import { AuthService } from './services/auth/auth.service';

@Component({
  imports: [RouterOutlet, SplashScreen],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);

  ngOnInit() {
    console.log(Aura);
  }
}
