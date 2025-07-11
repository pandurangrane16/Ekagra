import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from '../footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SessionService } from '../../services/common/session.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SlickCarouselModule, FooterComponent, MatFormFieldModule, MatInputModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  version: string = "2.0.0.0";
  sessionService = inject(SessionService);
  constructor() {

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
    this.loginForm = this.fb.group({
      userNameOrEmailAddress: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  showPassword: boolean = false;

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

   onLogin(): void {
    const credentials = this.loginForm.value;

    this.service.Login(credentials).subscribe({
      next: (res) => {
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




}
