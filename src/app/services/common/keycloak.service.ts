// src/app/services/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak.KeycloakInstance;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'https://10.100.43.108:8443/',
      realm: 'cmsrealm',
      clientId: 'Ekgara',
    });
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak
        .init({
          onLoad: 'login-required', // or 'check-sso' if you don't want auto-login
          checkLoginIframe: false, // Disable if using load balancing or iframe issues
          pkceMethod: 'S256', // recommended for security
          enableLogging: true,
        })
        .then((authenticated) => {
          resolve(authenticated);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  getToken(): Promise<string> {
    return this.keycloak.updateToken(30).then(() => {
      return this.keycloak.token!;
    });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed ? (this.keycloak.tokenParsed as any).preferred_username : undefined;
  }
}
