import { Component, Input, Output, EventEmitter, OnInit, signal, effect, HostBinding, APP_INITIALIZER, Inject, ChangeDetectorRef } from '@angular/core';
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
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
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
    {
      provide: APP_INITIALIZER,
      deps: [ThemeManagerService],
      useFactory: (themeService: ThemeManagerService) => () =>
        themeService.init(),
      multi: true,
    },
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})


export class HeaderComponent implements OnInit {
  isDarkMode = false;
  
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
    public headerService : HeaderService, private appRef: ApplicationRef, private cdRef: ChangeDetectorRef) {
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
 
}
