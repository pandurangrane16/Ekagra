import { Component, importProvidersFrom, inject, Inject, Input, input, OnInit, Renderer2 } from '@angular/core';
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
import { SessionService } from './services/common/session.service';
import { Globals } from './utils/global';

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
  appReady: boolean = false;
  _session = inject(SessionService);

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
    public headerService: HeaderService, 
    public routes: Router, 
    public route: ActivatedRoute,
    public loaderService: LoaderService,
    private signalRService: SignalRService,
    private snackBar: MatSnackBar,
    //private keycloakService: KeycloakService,
    public router: Router
  ) {
  }

  async getKeyCloakToken() {
    this.appReady = Globals.prototype.isKeycloakInitialized;
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
    // Show/hide header/sidebar based on route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide element on '/' and '/login', show on all other routes
        this.showElement = !(event.url === '/' || event.url.includes('login') || event.url.includes('register'));
      }
    });

    // Show global loader during navigation to avoid blank screen between redirects
    this.router.events.subscribe((event: any) => {
      const NavigationStart = (window as any).ng && (window as any).ng.coreTokens ? null : null; // noop to keep typing
      const evName = event.constructor && event.constructor.name;
      if (evName === 'NavigationStart') {
        this.loaderService.showLoader();
      }
      if (evName === 'NavigationEnd' || evName === 'NavigationCancel' || evName === 'NavigationError') {
        // small delay to avoid flicker
        setTimeout(() => this.loaderService.hideLoader(), 150);
      }
    });

    this.appReady = Globals.prototype.isKeycloakInitialized;
    // this.signalRService.notifications$.subscribe((message: string) => {
    //   // this.snackBar.open(message, 'Close', {
    //   //   duration: 5000,
    //   //   verticalPosition: 'top',
    //   //   horizontalPosition: 'right',
    //   //   panelClass: ['mat-toolbar', 'mat-primary']
    //   // });
    //   this.toastr.success(message);
    // });
    let _tags = this._session._getSessionValue("APITags");
    if(_tags == undefined) {
      //this._session._setSessionValue("APITags",)
    }

  }

}
