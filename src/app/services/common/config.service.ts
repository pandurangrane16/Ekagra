import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

export interface AppConfig {
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
    accountEndpoint: string;
  };
  backend: {
    url: string;
    apiBase: string;
  };
  keycloakInitOptions: {
    onLoad: string;
    checkLoginIframe: boolean;
    pkceMethod: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$ = new BehaviorSubject<AppConfig | null>(null);
  private configLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Load configuration from assets/config.json
   * Call this early in app initialization (e.g., in main.ts or app.component.ts)
   */
  async loadConfig(): Promise<AppConfig> {
    if (this.configLoaded && this.config$.value) {
      return this.config$.value;
    }

    try {
      const config = await firstValueFrom(this.http.get<AppConfig>('/assets/config.json'));
      this.config$.next(config);
      this.configLoaded = true;
      console.log('✅ Config loaded:', config);
      return config;
    } catch (err) {
      console.error('❌ Failed to load config.json:', err);
      throw err;
    }
  }

  /**
   * Get current config synchronously (use only after loadConfig() has been called)
   */
  getConfig(): AppConfig | null {
    return this.config$.value;
  }

  /**
   * Get config as observable (subscribe for reactive updates)
   */
  getConfig$() {
    return this.config$.asObservable();
  }

  // Convenience getters for common properties
  getKeycloakUrl(): string {
    return this.config$.value?.keycloak.url || '';
  }

  getKeycloakRealm(): string {
    return this.config$.value?.keycloak.realm || '';
  }

  getKeycloakClientId(): string {
    return this.config$.value?.keycloak.clientId || '';
  }

  getKeycloakAccountEndpoint(): string {
    return this.config$.value?.keycloak.accountEndpoint || '';
  }

  getBackendUrl(): string {
    return this.config$.value?.backend.url || '';
  }

  getBackendApiBase(): string {
    return this.config$.value?.backend.apiBase || '';
  }

  getKeycloakInitOptions(): any {
    return this.config$.value?.keycloakInitOptions || {};
  }
}
