import { Component, importProvidersFrom, Inject, Input, input, OnInit, Renderer2 } from '@angular/core';
import { FooterComponent } from './routes/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './routes/sidenav/sidenav.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from './routes/header/header.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { HeaderService } from './services/header.service';
import { LoginComponent } from "./routes/login/login.component";
import { CmLoaderComponent } from './common/cm-loader/cm-loader.component';
import { LoaderService } from './services/common/loader.service';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { SignalRService } from './services/common/signal-r.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from './Material.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    MaterialModule,
    SidenavComponent,
    FooterComponent,
    CmLoaderComponent,
    CommonModule,
    RouterModule,
  ],
  providers: [HeaderService, LoaderService, HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'Ekagra';
  event: any;
  windowWidth: number = 0;
  loggedIn = false;
  userProfile: any = null;

  @Input() isSidebarCollapsed = false;


  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onChange(event: Event) {
    this.event = event;
    this.headerService.shift120 = !this.headerService.shift120;
  }
  onClickEdit(event: Event) {
    this.event = event;
  }
  parentClass: string = '';

  onAddClass(className: string): void {
    this.parentClass = className;
  }
  token: any;
  showElement: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private toastr: ToastrService,
    public headerService: HeaderService, public routes: Router, public route: ActivatedRoute,
    public loaderService: LoaderService,
    private signalRService: SignalRService,
    private snackBar: MatSnackBar,
    //private keycloakService: KeycloakService,
    public router: Router
  ) {
  }

  async getKeyCloakToken() {
    // keycloakService.init()
    //   .then(() => {
    //     let return_data = bootstrapApplication(AppComponent, {
    //       providers: [provideHttpClient(), { provide: KeycloakService, useValue: keycloakService }]
    //     });

    //     return return_data;
    //   })
    //   .catch(err => {
    //     console.error('Keycloak initialization failed', err);
    //   });
  }

  async ngOnInit() {
   this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide element on '/' and '/login', show on all other routes
        this.showElement = !(event.url === '/' || event.url.includes('login') ||  event.url.includes('register'));
      }
    });
    // this.signalRService.notifications$.subscribe((message: string) => {
    //   // this.snackBar.open(message, 'Close', {
    //   //   duration: 5000,
    //   //   verticalPosition: 'top',
    //   //   horizontalPosition: 'right',
    //   //   panelClass: ['mat-toolbar', 'mat-primary']
    //   // });
    //   this.toastr.success(message);
    // });
  }



}
