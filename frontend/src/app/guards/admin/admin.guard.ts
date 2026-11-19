import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateSession().pipe(
    map((isValid) => {
      if (!isValid) {
        return router.createUrlTree(['/login']);
      }

      if (auth.currentUser()?.role !== 'admin') {
        return router.createUrlTree(['/']);
      }

      return true;
    }),
  );
};
