import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideOptimus } from '@openng/optimus-ui/config';
import { CustomPresent } from './theme/theme';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({
      theme: { preset: CustomPresent, options: { darkModeSelector: true } },
      ripple: true,
    }),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideCharts(withDefaultRegisterables()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
