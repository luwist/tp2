import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandPanel } from '../brand-panel/brand-panel';
import { AuthIllustration } from '../auth-illustration/auth-illustration';

@Component({
  imports: [RouterLink, BrandPanel, AuthIllustration],
  selector: 'app-auth',
  styleUrl: './auth.scss',
  templateUrl: './auth.html',
})
export class Auth {
  readonly size = input<'default' | 'wide'>('default');

  readonly headline = input.required<string>();
  readonly description = input.required<string>();

  readonly heading = input.required<string>();
  // readonly subtitle = input.required<string>();

  readonly switchText = input.required<string>();
  readonly switchLinkText = input.required<string>();
  readonly switchLinkPath = input.required<string>();

  step = input<string>();
}
