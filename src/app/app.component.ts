import { Component, Inject, Input, input, OnInit, Renderer2 } from '@angular/core';
import { FooterComponent } from './routes/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './routes/sidenav/sidenav.component';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from './routes/header/header.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { HeaderService } from './services/header.service';
import { LoginComponent } from "./routes/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    MatSidenavModule,
    SidenavComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
],
  providers:[HeaderService],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 
})
export class AppComponent implements OnInit{
  title = 'Ekagra';
  event: any;
  windowWidth: number = 0;
  @Input() isSidebarCollapsed = false;
  

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onChange(event: Event) {
    this.event = event;
    this.headerService.shift120 = !this.headerService.shift120;
  }
 onClickEdit(event: Event){
  this.event = event;
 }
 parentClass: string = '';

  onAddClass(className: string): void {
    this.parentClass = className;
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
    public headerService : HeaderService,public routes: Router, private route: ActivatedRoute,
  ) {}

 
  ngOnInit()  {}

}
