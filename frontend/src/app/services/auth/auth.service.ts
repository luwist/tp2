import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { LoginRequestDTO } from '@app/dto/requests';
import { RegisterRequestDTO } from '@app/dto/requests/register.request';
import { AuthResponse, User } from '@app/dto/responses';
import { toFormData } from '@app/utils';
import { environment } from '@environments/environment';
import { BehaviorSubject, catchError, delay, map, of, tap } from 'rxjs';

type SessionStatus = 'checking' | 'authenticated' | 'unauthenticated';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  private readonly _status = signal<SessionStatus>(
    localStorage.getItem('token') ? 'checking' : 'unauthenticated',
  );

  readonly isChecking = computed(() => this._status() === 'checking');
  readonly isAuthenticated = computed(() => this._status() === 'authenticated');

  currentUser = signal<User | null>(null);

  login(request: LoginRequestDTO) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  register(request: RegisterRequestDTO) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, toFormData(request))
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  logout(): void {
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);
  }

  validateSession() {
    if (this._status() === 'authenticated') {
      return of(true);
    }

    if (!this.getToken()) {
      this._status.set('unauthenticated');
      return of(false);
    }

    this._status.set('checking');

    return this.http.get<any>(`${environment.apiUrl}/auth/me`).pipe(
      delay(5000),
      tap((data) => {
        // localStorage.setItem('currentUser', JSON.stringify(data));

        console.log('VALIDATION SESIONNNNNNNNN');
        this.currentUser.set(data.user);
        this._status.set('authenticated');

        console.log(data);
        console.log(this._status());
        console.log(this.isChecking());
      }),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) return null;

    const user = JSON.parse(currentUser);

    return user.token;
  }
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(response));

    this.currentUser.set(response.user);
  }

  clearSession() {
    console.log('SE BORRA EL TOKEN?????');
    localStorage.removeItem('currentUser');

    // this._token.set(null);
    this.currentUser.set(null);
    this._status.set('unauthenticated');
  }

  private setSession(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));

    // this._token.set(token);
    this.currentUser.set(user);
    this._status.set('authenticated');
  }
}
