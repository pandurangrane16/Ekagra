import { ChangeDetectionStrategy, inject, Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from '../footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { loginservice } from '../../services/admin/login.service';
import { MatButtonModule } from '@angular/material/button';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { SessionService } from '../../services/common/session.service';
import { KeycloakService, KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import { Globals } from '../../utils/global';



@Component({
  selector: 'app-login',
  imports: [CommonModule, SlickCarouselModule, MatButtonModule, ReactiveFormsModule, MatButtonModule, ReactiveFormsModule, FooterComponent, MatFormFieldModule, MatInputModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loaderService = inject(LoaderService);
  sessionService = inject(SessionService);


  authenticated = false;
  keycloakStatus: string | undefined;
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  loginForm!: FormGroup;
  version: string = "2.0.18";
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private service: loginservice,
    private keycloakService: KeycloakService,
  ) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }



  slideConfig = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    fadeSpeed: 1000,
    fade: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  slides = [
    { img: '/assets/img/login_bg1.jpg' },
    { img: '/assets/img/login_bg2.jpg' },
    { img: '/assets/img/login_bg3.jpg' },
    { img: '/assets/img/login_bg4.jpg' },
  ];

  ngOnInit(): void {
    debugger;
    this.loginForm = this.fb.group({
      userNameOrEmailAddress: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.getConfigDetails();
     const keycloak =  this.keycloakService.getKeycloakInstance();

  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    console.log('User Info from Keycloak:', tokenParsed);

 
  
  }

  if(Globals.prototype.isKeycloakInitialized) {
    this.router.navigate(['/dashboard']);
  }

  }
  getConfigDetails() {
    this.service.getConfigDetails().subscribe(res => {
      if (res != undefined) {
        this.sessionService._setSessionValue("config", JSON.stringify(res));
      }
    })
  }
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  async onSSOLogin() {
    try {
      await this.keycloakService.login({

        
        redirectUri: window.location.origin + '/#/dashboard' // 👈 redirect after login

         


      });
    } catch (error) {
      console.error('SSO login failed', error);
    }
  }


  onLogin() {
    const credentials = this.loginForm.value;

    this.service.Login(credentials).pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        const accessToken = res?.result?.accessToken;
        if (accessToken) {

          this.router.navigate(['/dashboard']);
        } else {
          alert('Login failed: No token received');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed: Invalid credentials or server error');
        this.loginForm.reset();
      }
    });
  }

// async register() {
//   try {
//     const keycloak = await this.keycloakService.getKeycloakInstance();
//       await keycloak.logout({
//       redirectUri: window.location.origin, // redirect to app home after logout
//     }); 

//         const isLoggedIn = await this.keycloakService.isLoggedIn();
//     console.log('👤 Is user currently logged in?', isLoggedIn);

//     const registerUrl = keycloak.createRegisterUrl({
//       redirectUri: window.location.origin + '/#/dashboard'
//     });
//     window.location.href = (await registerUrl).toString()
//   } catch (error) {
//     console.error('Failed to open register page', error);
//   }
// }

async register() {
  const keycloak = await this.keycloakService.getKeycloakInstance();
  console.log('🚪 Logging out current user before registration...');
  
  const logoutUrl = keycloak.createLogoutUrl({
    redirectUri: window.location.origin + '/#/register-redirect'
  });
debugger;
  window.location.href = logoutUrl;
}





}
