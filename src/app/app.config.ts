import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { LoaderInterceptor } from './services/interceptors/loader.interceptor';
import { provideToastr } from 'ngx-toastr';
import { KeycloakService } from './services/common/keycloak.service';
import { AppComponent } from './app.component';
const keycloakService = new KeycloakService();
keycloakService.init()
  .then(() => {
    return bootstrapApplication(AppComponent, {
      providers: [provideHttpClient(), { provide: KeycloakService, useValue: keycloakService }]
    });
  })
  .catch(err => {
    console.error('Keycloak initialization failed', err);
  });
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideToastr(),
    // provideHttpClient(
    //   withInterceptors([
    //     LoaderInterceptor
    //   ])
    // )
    provideHttpClient()
  ]
};
