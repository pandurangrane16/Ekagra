// src/app/services/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KeycloakService as key } from 'keycloak-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserprofileModel } from '../../models/admin/userprofile.model';
import { HttpService } from '../common/http.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak.KeycloakInstance;

  constructor(
    private http: HttpClient,
    private keyService: key,
    private _httpService: HttpService,
    private config: ConfigService
  ) {
    const cfg = this.config.getConfig();
    console.log('Keycloak config:', cfg);
    this.keycloak = new Keycloak({
      url: cfg?.keycloak.url || 'https://172.19.10.43:8443/',
      realm: cfg?.keycloak.realm || 'cmsrealm',
      clientId: cfg?.keycloak.clientId || 'Ekgara',
    });
  }

  // init(): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.keycloak
  //       .init({
  //         onLoad: 'login-required', // or 'check-sso' if you don't want auto-login
  //         checkLoginIframe: false, // Disable if using load balancing or iframe issues
  //         pkceMethod: 'S256', // recommended for security
  //         enableLogging: true,
  //       })
  //       .then((authenticated) => {
  //         resolve(authenticated);
  //       })
  //       .catch(() => {
  //         reject(false);
  //       });
  //   });
  // }

 init(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.keycloak
      .init({
        onLoad: 'check-sso', // ✅ check if user already has an active session
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html', // ✅ helps Keycloak restore session silently
        checkLoginIframe: false, // Disable for simpler setups
        pkceMethod: 'S256', // recommended for security
        enableLogging: true,
      })
      .then((authenticated) => {
        if (!authenticated) {
          console.warn('User not logged in, redirecting to login...');
          this.keycloak.login(); // redirect if not logged in
        }
        resolve(authenticated);
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
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

  getProfile() {
  debugger;

  const keycloak = this.keyService.getKeycloakInstance();
  let token = null;

  if (keycloak.authenticated) {
    token = keycloak.token;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const cfg = this.config.getConfig();
  const accountUrl = `${cfg?.keycloak.url}${cfg?.keycloak.accountEndpoint}` ||
    'https://172.19.10.43:8443/realms/cmsrealm/account';

  return this.http.get<any>(accountUrl, { headers });
}
  updateProfile(payload:UserprofileModel) {
debugger;

    const keycloak =  this.keyService.getKeycloakInstance();
     let token=null;
    if (keycloak.authenticated) {
       token =keycloak.token
    }
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const cfg = this.config.getConfig();
  const accountUrl = `${cfg?.keycloak.url}${cfg?.keycloak.accountEndpoint}` ||
    'https://172.19.10.43:8443/realms/cmsrealm/account';

  return this.http.post<any>(accountUrl, payload, { headers });
  
}


// updateAbpUser(payload: any) {
//   const url = '/api/services/app/UserConf/UpdateUserProfile';

//   return this.http.post(url, payload, {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json'
//     })
//   });
// }

  updateAbpUser(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/UserConf/UpdateUserProfile');
  }


}
