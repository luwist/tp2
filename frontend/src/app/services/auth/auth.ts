import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user = signal<any | null>(this.readStoredUser());
  readonly _token = signal<string | null>(localStorage.getItem('token'));

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();

  readonly isAuthenticated = computed(() => !!this._token());

  login(credentials: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(datita: any, file: any) {
    const datas = new FormData();

    datas.append('avatar', file);
    datas.append('firstName', datita.firstName);
    datas.append('lastName', datita.lastName);
    datas.append('username', datita.username);
    datas.append('email', datita.email);
    datas.append('password', datita.password);
    datas.append('confirmPassword', datita.confirmPassword);
    datas.append('birthDate', datita.birthDate);
    datas.append('bio', datita.bio);

    return this.http
      .post<any>(`${environment.apiUrl}/auth/register`, datas)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  private setSession({ user, token }: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this._token.set(token);
    this._user.set(user);
  }

  private readStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('user');

      return raw ? (JSON.parse(raw) as any) : null;
    } catch {
      return null;
    }
  }
}
