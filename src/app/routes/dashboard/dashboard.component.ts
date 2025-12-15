import { MatMenuModule } from '@angular/material/menu';
import { Component, ElementRef, inject, OnInit, viewChild,OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { WidgetComponent } from '../../widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { wrapGrid } from 'animate-css-grid';
import {CdkDragDrop, CdkDropList, moveItemInArray, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { SessionService } from '../../services/common/session.service';
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../services/common/common';
import { LoaderService } from '../../services/common/loader.service';
import { DashboardService2 } from '../../services/admin/dashboard.service';
import { Router } from '@angular/router';
import { Globals } from '../../utils/global';



@Component({
    selector: 'app-dashboard',
    imports: [WidgetComponent, MatButtonModule, MatIcon, MatMenuModule, CdkDropList, CdkDropListGroup, CommonModule],
    providers: [DashboardService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit{
store = inject(DashboardService);
session = inject(SessionService);
loaderService = inject(LoaderService);
editDashboard = true;
show = false;
userInfo: any; 
dashboard = viewChild.required<ElementRef>('dashboard');


constructor(private keycloakService: KeycloakService,
   private toastr : ToastrService , 
   private router: Router,
   private service :DashboardService2,
   private globals:Globals ) {}

async ngOnInit(){
  this.session._setSessionValue("APITags",null)
  console.log(this.session._getSessionValue("UserValidation"));
  wrapGrid(this.dashboard().nativeElement,{duration:300});
   // Subscribe to the toggle event


  const keycloak = await this.keycloakService.getKeycloakInstance();


  //    const registerUrl = keycloak.createRegisterUrl({
  //      redirectUri: window.location.origin + '/#/dashboard'
  //    });
  //  window.location.href = (await registerUrl).toString()


debugger;
  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    const subId = tokenParsed?.sub
    console.log('User Info from Keycloak:', tokenParsed);
  }

const isLoggedIn = await this.keycloakService.isLoggedIn();
debugger;
if (isLoggedIn) {
  const profile = await this.keycloakService.loadUserProfile();
     const tokenParsed = keycloak.tokenParsed;
    const attributes = profile?.attributes as Record<string, string[]>;
    const mobile = attributes?.['mobile']?.[0] ?? null;

  console.log('User Profile:', profile);
      this.userInfo = {
      ...this.userInfo,
      name: profile?.firstName || this.userInfo?.name,
      surname: profile?.lastName || this.userInfo?.surname,
      email: profile?.email || this.userInfo?.email,
      username: profile?.username || this.userInfo?.username,
      subId: tokenParsed?.sub,
      contactNumber: mobile,

    };
    console.log('userinfo',this.userInfo);
} else {
  console.warn('User not logged in yet!');
}

 this.OnRegister();

  
 
}





drop(event: CdkDragDrop<number, any>){
  const {previousContainer , container} = event;
  this.store.updateWidgetPosition(previousContainer.data, container.data)
}


OnRegister() {
  try {
    if (!this.userInfo || !this.userInfo.email) {
      this.toastr.warning('User information is missing. Please log in via Keycloak first.');
      return;
    }

    const emailOrUsername = this.userInfo.email || this.userInfo.username;

    // 1️⃣ Check if user already exists
    debugger;
    this.service.CheckUserOrEmailExists(emailOrUsername)
    
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (checkResponse: any) => {
          console.log('User Check Response:', checkResponse);

         if (checkResponse?.success === true && checkResponse?.result){
debugger;
  const existingUser = checkResponse.result;

                            sessionStorage.setItem('userInfo', JSON.stringify(existingUser));
            this.globals.user = existingUser;
                 debugger;
            // ✅ User already exists
        
            return;
          }

     

         


        },
        error: (err: any) => {
          console.error('User Check API Error:', err);
                const errorMessage = err?.error?.error?.details || err?.message;

                    if (errorMessage && errorMessage.toLowerCase().includes('user not found'))
          {
              
                      // 2️⃣ User does not exist → Register via ABP API
          const requestBody = {
            name: this.userInfo.name,
            surname: this.userInfo.surname,
            userName: this.userInfo.username,
            emailAddress: this.userInfo.email,
            password: this.userInfo.username, // same as username
            captchaResponse: '',
            phoneNumber: this.userInfo.contactNumber || ''
          };

          const signInToken = this.userInfo.subId; // 👈 sub from Keycloak token

          this.service.RegisterWithoutCaptcha(signInToken, requestBody)
            .pipe(withLoader(this.loaderService))
            .subscribe({
              next: (response: any) => {
                console.log('Registration API Response:', response);

                if (response?.success === true) {

                        const newUser = response.result;

                    // ✅ Save user in session & globals
                    sessionStorage.setItem('userInfo', JSON.stringify(newUser));
                    this.globals.user = newUser;
                  this.router.navigate(['/dashboard']);
                } else {
                  const message = response?.error?.message || 'Registration failed.';
                  const details = response?.error?.details || '';
                  console.log('Registration API Response:',message,details)
             
                }
              },
              error: (err: any) => {
                console.error('Registration API Error:', err);
                const message = err?.error?.error?.message || 'Registration failed';
                const details = err?.error?.error?.details || '';
              console.log('Registration API Error:',message,details)
              }
            });
          
          }

           else {
        // ❌ Handle genuine server errors
        console.error('Unexpected error while checking user:', err);
        this.toastr.error('Something went wrong while checking the user.');
      }


          //this.toastr.error('Failed to verify user existence. Please try again.');
        }
      });
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    //this.toastr.error('An unexpected error occurred during registration.');
  }
}





}
