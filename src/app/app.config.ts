import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideKeycloakAngular } from './services/common/keycloak.config';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(kc: KeycloakService) {
  return () => {
    const isBrowser = typeof window !== 'undefined';

    return kc
      .init({
        config: {
          // ✅ Use your Keycloak base URL
          url: 'https://172.19.10.43:8443',
          realm: 'cmsrealm',
          clientId: 'Ekgara',
        },
        initOptions: {
          // 🔄 Use 'login-required' if all routes need auth, or 'check-sso' for optional login
         onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/check-sso.html',
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets', '/public'],
      })
      .then(() => {
        console.info('✅ Keycloak initialized successfully');
      })
      .catch(err => {
        console.error('❌ Keycloak init failed:', err);
        // Return a resolved promise to prevent Angular bootstrap failure during debugging
        return Promise.resolve();
      });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [

    provideKeycloakAngular(),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    provideRouter(routes, withHashLocation()), // Use hash-based routing if desired
    provideHttpClient(),
    provideToastr(),
    provideAnimationsAsync(),
    provideClientHydration(),
  ],
};