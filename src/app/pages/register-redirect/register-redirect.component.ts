import { Component, inject,OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';

@Component({
  selector: 'app-register-redirect',
  templateUrl: './register-redirect.component.html',
  styleUrls: ['./register-redirect.component.css'] 
})
export class RegisterRedirectComponent implements OnInit {
   loaderService = inject(LoaderService);
  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    try {
      console.log('✅ Arrived at /register-redirect, preparing to open Keycloak registration form...');
      this.loaderService.showLoader();

      await new Promise(resolve => setTimeout(resolve, 500));

      const keycloak = await this.keycloakService.getKeycloakInstance();

      // 🔹 createRegisterUrl returns a STRING, not a Promise
      let registerUrl = keycloak.createRegisterUrl({
        redirectUri: window.location.origin + '/#/dashboard'
      });
       let registerUrl2=(await registerUrl).toString()

      // 🔹 Append &prompt=login only if you still get "already authenticated" issues
      registerUrl2 += '&prompt=login';

      console.log('➡️ Redirecting to:', registerUrl2);

      // 🔹 Navigate to Keycloak registration page
      window.location.href = registerUrl2;

    } catch (error) {
      console.error('❌ Failed to redirect to registration page:', error);
      this.loaderService.hideLoader();
    }
    finally {
      // Fallback: hide loader after 2 seconds if something goes wrong
      setTimeout(() => this.loaderService.hideLoader(), 2000);
    }
  }
}
