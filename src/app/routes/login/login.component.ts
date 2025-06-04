import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from '../footer/footer.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [CommonModule, SlickCarouselModule, FooterComponent, MatFormFieldModule, MatInputModule, MatIconModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  slideConfig = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    fadeSpeed: 1000,
    fade:true,
    arrows:false,
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
}
