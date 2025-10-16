import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak!: KeycloakInstance;

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.keycloak = new Keycloak({
        url: 'https://10.100.43.108:8443/',
        realm: 'cmsrealm',
        clientId: 'Ekgara'
      });

      this.keycloak
        .init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256'
        })
        .then(authenticated => {
          if (!authenticated) {
            this.keycloak.login();
          }
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  logout(): void {
    this.keycloak?.logout();
  }

  getKeycloakInstance(): KeycloakInstance {
    return this.keycloak;
  }
}
