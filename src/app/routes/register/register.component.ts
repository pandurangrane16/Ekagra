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
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  imports: [CommonModule, SlickCarouselModule, MatButtonModule, ReactiveFormsModule, MatButtonModule, ReactiveFormsModule, FooterComponent, MatFormFieldModule, MatInputModule, MatIconModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
loaderService = inject(LoaderService);
  sessionService = inject(SessionService);


  authenticated = false;
  keycloakStatus: string | undefined;
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  form!: FormGroup;
  version: string = "2.0.9";
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private service: loginservice,
    private keycloakService: KeycloakService,
    private toastr : ToastrService
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
    this.form = this.fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email :['', Validators.required],
      userNameOrEmailAddress: ['', Validators.required],
      password: ['', Validators.required],
      retypePassword : ['', Validators.required],
    });

    this.getConfigDetails();
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
        redirectUri: window.location.origin + '/dashboard' // 👈 redirect after login
      });
    } catch (error) {
      console.error('SSO login failed', error);
    }
  }

  OnRegister() {
    const formVal = this.form.value;
    this.toastr.success(
  "Your request has been successfully submitted. You will receive an email notification once your request has been reviewed and approved.",
  '',
  { timeOut: 10000,
    positionClass: 'toast-bottom-center',
    toastClass: 'ngx-toastr toast-custom-width',
   }
);
  }

}
