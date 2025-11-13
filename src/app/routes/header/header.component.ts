import { Component, Input, Output, EventEmitter, OnInit, signal, effect, HostBinding, Inject, ChangeDetectorRef, inject, provideAppInitializer } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormsModule, NgModel } from '@angular/forms';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import {OverlayContainer} from "@angular/cdk/overlay";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemingService } from '../../services/theming.service';
import { HeaderService } from './../../services/header.service';
import { ThemeManagerService } from '../../services/theme-manager.service';
import { ApplicationRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Router, NavigationEnd } from '@angular/router';
import { filter, delay } from 'rxjs/operators';
import { LoaderService } from '../../services/common/loader.service';

import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-header',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        CommonModule,
        RouterModule,
        FormsModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatGridListModule
    ],
    // providers:[HeaderService,ThemingService],
    providers: [HeaderService,
        ThemeManagerService,
      //   provideAppInitializer(() => {
      //   const initializerFn = ((themeService: ThemeManagerService) => () => themeService.init())(inject(ThemeManagerService));
      //   return initializerFn();
      // }),
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})


export class HeaderComponent implements OnInit {
  isDarkMode = false;
  userInfo: any = null;
  userName: string = ''
  
  online: boolean = true;
  isSidebarCollapsed:boolean =true;
  hideCustomisation = false;
  @Output() eventChange = new EventEmitter<Event>();
  mode:string = 'dark_mode'
  theaming: boolean = false;
  editDashboard = false;
  onClick(event: Event) {
    this.eventChange.emit(event); 
    this.isSidebarCollapsed = !this.isSidebarCollapsed;  
    // this.headerService.showLogo = !this.headerService.showLogo;
    console.log(this.headerService.showLogo);
  }
  
 
  constructor(private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: Document,
    private readonly themingService: ThemingService, private themeService: ThemeManagerService,
    public headerService : HeaderService, private appRef: ApplicationRef, private cdRef: ChangeDetectorRef,  
    private loaderService: LoaderService,    private keycloakService: KeycloakService,
    private router: Router) {
  }
 
  // toggleTheme() {
  //   this.themingService.toggleTheme();
  //   this.toggleMode2();
  // }
  toggleMode2() {
    this.mode = this.mode === 'light_mode' ? 'dark_mode' : 'light_mode';
  }
  onClickEdit() {
    this.theaming= false;
    alert('fssff')
  }
  changeTheme() {
    this.themeService.toggleTheme();
    this.toggleMode2();
  }

  getTheme() {
    return this.themeService.theme;
  }
  
  @Input()
  set event(event: Event) {
    if (event) {
      this.toggleLogo();
    }
  }

  toggleLogo() {
    this.headerService.showLogo = !this.headerService.showLogo;
  }


  ngOnInit(): void {

      this.loadUserInfo();

  // 🟢 STEP 2: Recheck user info whenever route changes (like after login/registration)
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      debugger;
      this.loadUserInfo();
    });

      const storedUser = sessionStorage.getItem('userInfo');
debugger;
    if (storedUser) {
      this.userInfo = JSON.parse(storedUser);
      this.userName = this.userInfo?.name || this.userInfo?.userName || '';
      console.log('User info loaded in header:', this.userInfo);
    }


    this.document.documentElement.className = 'dark_theme';


    this.simulateAsyncOperation().subscribe(() => {
      // Mark the app as stable after async operation completes
      this.appRef.isStable.pipe(delay(500)).subscribe(stable => {
        if (stable) {
          console.log('Application has stabilized!');
        }
      });
    });
    this.headerService.toggleEvent$.subscribe(() => {
      console.log('State updated, manually triggering change detection');
    this.cdRef.detectChanges();  // Force Angular to update the view
      // You can add additional logic to handle the event (e.g., alert, update UI, etc.)
    });
    this.headerService.modify.subscribe((value) => (this.editDashboard = value));
  }

  private loadUserInfo(): void {
  const storedUser = sessionStorage.getItem('userInfo');
  if (storedUser) {
    this.userInfo = JSON.parse(storedUser);
    this.userName = this.userInfo?.name || this.userInfo?.userName || '';
    console.log('User info loaded in header:', this.userInfo);
  } else {
    this.userInfo = null;
    this.userName = '';
  }
}

  showEdit() {
     this.headerService.sendValue(!this.editDashboard);
    // this.headerService.changeEdit();
    console.log('Header- ' + this.headerService.editDashboard.value);
  }
  onToggleEdit() {
    this.headerService.toggle();
    this.cdRef.detectChanges();
  }
  simulateAsyncOperation(): Observable<any> {
    // Simulate an async operation (e.g., HTTP request)
    return of(true).pipe(delay(2000)); // Simulate a delay of 2 seconds
  }

  async logout() {
    sessionStorage.removeItem('userInfo');
    try {
      console.log('🚪 Logging out user...');
      this.loaderService.showLoader();

      // Get the Keycloak instance
      const keycloak = this.keycloakService.getKeycloakInstance();

      // Build logout URL (Keycloak handles session cleanup)
      const logoutUrl = keycloak.createLogoutUrl({
        redirectUri: window.location.origin + '/#/dashboard' // redirect back to login after logout
      });

      console.log('➡️ Redirecting to logout URL:', logoutUrl);

      // Redirect the user
      window.location.href = logoutUrl;

    } catch (error) {
      console.error('❌ Logout failed:', error);
      this.loaderService.hideLoader();
      this.router.navigate(['/dashboard']);
    } finally {
      // Hide loader if redirect doesn’t occur
      setTimeout(() => this.loaderService.hideLoader(), 1500);
    }
  }
 
}
