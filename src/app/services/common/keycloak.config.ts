import { provideKeycloak, createInterceptorCondition, withAutoRefreshToken, AutoRefreshTokenService, UserActivityService, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition } from 'keycloak-angular';
import { AppConfig } from './config.service';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:4200)(\/.*)?$/i
});












export const provideKeycloakAngular = (config?: AppConfig) =>
  provideKeycloak({
    config: {
      url: config?.keycloak.url || 'https://172.19.10.43:8443',
      realm: config?.keycloak.realm || 'cmsrealm',
      clientId: config?.keycloak.clientId || 'Ekgara',
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/check-sso.html',
      redirectUri: window.location.origin + '/dashboard'
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000
      })
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition]
      }
    ]
  });