import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import avatar from '@openng/optimus-ui-themes/nora/avatar';

type SessionStatus = 'checking' | 'authenticated' | 'unauthenticated';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user = signal<any | null>(this.readStoredUser());
  readonly _token = signal<string | null>(localStorage.getItem('token'));

  private readonly _status = signal<SessionStatus>(
    localStorage.getItem('token') ? 'checking' : 'unauthenticated',
  );

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();

  readonly isChecking = computed(() => this._status() === 'checking');
  readonly isAuthenticated = computed(() => this._status() === 'authenticated');

  login(credentials: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(data: any) {
    const formData = new FormData();

    console.log(data);

    Object.entries(data).forEach(([key, value]) => {
      console.log(key);
      console.log(value);

      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    console.log(formData);

    return this.http
      .post<any>(`${environment.apiUrl}/auth/register`, formData)
      .pipe(tap((response) => this.setSession(response)));
  }

  validateSession(): Observable<boolean> {
    if (this._status() === 'authenticated') {
      return of(true);
    }

    if (!this._token()) {
      this._status.set('unauthenticated');
      return of(false);
    }

    this._status.set('checking');

    console.log('AUTH | STATUS');
    console.log(this._status());
    console.log(this.isChecking);

    return this.http
      .get<any>(`${environment.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${this._token()}` },
      })
      .pipe(
        delay(5000),
        tap((data) => {
          console.log(data);

          localStorage.setItem('user', JSON.stringify(data.user));
          this._user.set(data.user);
          this._status.set('authenticated');

          console.log(this._status());
          console.log(this.isChecking);
        }),
        map(() => true),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
      );
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._token.set(null);
    this._user.set(null);
    this._status.set('unauthenticated');
  }

  private setSession({ user, token }: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this._token.set(token);
    this._user.set(user);
    this._status.set('authenticated');
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
