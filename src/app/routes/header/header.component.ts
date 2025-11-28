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
import { Globals } from '../../utils/global';
import { headerservice2 } from '../../services/admin/header.service';


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
    public headerService : HeaderService,private service:headerservice2, private appRef: ApplicationRef, private cdRef: ChangeDetectorRef,  
    private loaderService: LoaderService,    private keycloakService: KeycloakService,
    private router: Router,private globals:Globals) {
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


  // 🟢 STEP 1: Restore from sessionStorage if Globals is empty
  if (!this.globals.user) {
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      this.globals.user = JSON.parse(storedUser);
      console.log('✅ User restored from sessionStorage:', this.globals.user);
    }
  }
debugger;
 

  // 🟢 STEP 2: Subscribe reactively to user updates
this.globals.user$.subscribe(user => {
  this.userInfo = user;
  this.userName = user?.name || user?.userName || '';

  console.log('👤 User info updated in header:', this.userInfo);

  // 🔄 REFRESH ROLE DETAILS WHEN USER CHANGES
  if (user?.id) {
    this.fetchUserRoleDetails(user.id);
  }
});


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
fetchUserRoleDetails(userId: number) {
  debugger;
  this.service.GetRoleCategeoryOnUserId(userId).subscribe({
    next: (res: any) => {
      debugger;
      const items = res?.result?.items;

      if (Array.isArray(items) && items.length > 0) {
        const mapping = items[0];   // { userId, roleId, zoneId, category }

        // Save in Globals + SessionStorage
        this.globals.saveUserMapping(mapping);

        console.log('🔐 User Mapping saved in globals:', mapping);
      } else {
        console.warn('⚠ No user role mapping found');
      }
    },
    error: (err) => {
      console.error('❌ Failed to load user role mapping', err);
    }
  });
}



private loadUserInfo(): void {
  // 🟢 First, check if user already exists in Globals
  const globalUser = this.globals.user;

  if (globalUser) {
    this.userInfo = globalUser;
    this.userName = globalUser?.name || globalUser?.userName || '';
    console.log('User info loaded from Globals:', this.userInfo);
    return;
  }

  // 🟢 If not found, fallback to sessionStorage
  const storedUser = sessionStorage.getItem('userInfo');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    this.userInfo = parsedUser;
    this.userName = parsedUser?.name || parsedUser?.userName || '';
    console.log('User info restored from sessionStorage:', this.userInfo);

    // 🔄 Sync it back to Globals so other components get updated too
    this.globals.user = parsedUser;
  } else {
    // ❌ No user found → clear local state
    this.userInfo = null;
    this.userName = '';
    console.log('No user info found — cleared header state.');
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
