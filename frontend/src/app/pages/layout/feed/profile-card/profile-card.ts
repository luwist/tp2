import { Component, inject } from '@angular/core';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  imports: [],
  selector: 'app-profile-card',
  styleUrl: './profile-card.scss',
  templateUrl: './profile-card.html',
})
export class ProfileCard {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;

  ngOnInit() {
    console.log('CURRENT USER');
    console.log(this.auth.currentUser());
    console.log('CURRENT USER');
  }
}
