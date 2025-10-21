import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { LoaderInterceptor } from './services/interceptors/loader.interceptor';
import { provideToastr } from 'ngx-toastr';
//import { KeycloakService } from './services/common/keycloak.service';
import { AppComponent } from './app.component';
import { provideKeycloakAngular } from './services/common/keycloak.config';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';


const keycloakService = new KeycloakService();

keycloakService
  .init({
    config: {
      url: 'https://10.100.43.108:8443',
      realm: 'cmsrealm',
      clientId: 'Ekgara',
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: window.location.origin + '/assets/check-sso.html',
      redirectUri: window.location.origin + '/dashboard'
    },
    enableBearerInterceptor: true,
    bearerExcludedUrls: ['/assets'],
  })
  .then(() => {
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(KeycloakAngularModule),
        { provide: KeycloakService, useValue: keycloakService },
      ],
    }).catch(err => console.error(err));
  });

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAngular(),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideToastr(),
    // provideHttpClient(
    //   withInterceptors([
    //     LoaderInterceptor
    //   ])
    // )
    provideHttpClient(),
  ]
};
