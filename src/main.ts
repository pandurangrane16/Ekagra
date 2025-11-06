/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));









//   /// <reference types="@angular/localize" />

// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';
// import { importProvidersFrom } from '@angular/core';
// import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

// // ✅ Create a KeycloakService instance manually
// const keycloakService = new KeycloakService();

// async function initializeKeycloak() {
//   try {
//     await keycloakService.init({
//       config: {
//         url: 'https://10.100.43.108:8443/', // ✅ Keycloak base URL
//         realm: 'cmsrealm',                  // ✅ Your realm name
//         clientId: 'Ekgara'                     // ✅ Your client ID
//       },
//       initOptions: {
//         onLoad: 'check-sso', // 👈 or 'login-required' if you want forced login
//         silentCheckSsoRedirectUri:
//           window.location.origin + '/assets/silent-check-sso.html'
//       }
//     });
//     console.log('✅ Keycloak initialized successfully');
//   } catch (error) {
//     console.error('❌ Keycloak initialization failed', error);
//   }
// }

// // ✅ Wait for Keycloak to initialize before bootstrapping Angular
// initializeKeycloak().then(() => {
//   bootstrapApplication(AppComponent, {
//     providers: [
//       importProvidersFrom(KeycloakAngularModule),
//       { provide: KeycloakService, useValue: keycloakService },
//       ...appConfig.providers, // 👈 preserve your existing providers (important)
//     ],
//   }).catch(err => console.error(err));
// });
