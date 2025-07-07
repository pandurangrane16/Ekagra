import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HeaderService } from '../../services/header.service';
import { MaterialModule } from '../../Material.module';


interface MenuItem {
  icon: string;
  activeIcon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  link: string;
  hasChild: boolean;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  providers: [HeaderService],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  isSidebarCollapsed = true;

  @Output() logoShow = new EventEmitter<Event>();
  @Output() sidebarToggle = new EventEmitter<void>();
  @Input()
  set event(event: Event) {
    if (event) {
      this.toggle();
    }
  }
  @Output() eventChange = new EventEmitter<Event>();



  onClick(event: Event) {
    this.eventChange.emit(event);

  }

  constructor(public headerService: HeaderService, public routes: Router, private route: ActivatedRoute) {

  }
  toggleLogoMain() {
    this.headerService.showLogo = !this.headerService.showLogo;
    console.log(this.headerService.showLogo);
  }
  toggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.toggleLogoMain();
  };
  // toggleLogo(event:Event) {
  //   let showLogo = this.logoShow.emit(event);
  // }
  menuItems: MenuItem[] = [
    {
      icon: './assets/img/icon_dashboard1.svg',
      label: 'Dashboard',
      link: 'dashboard',
      activeIcon: './assets/img/icon_dashboard2.svg',
      hasChild: false,
      // isOpen: false,
      // children: [
      //   { icon: 'fas fa-chart-pie', label: 'Analytics' },
      //   { icon: 'fas fa-tasks', label: 'Projects' },
      // ]
    },
    {
      icon: './assets/img/icon_surveillance.svg',
      activeIcon: './assets/img/icon_surveillance1.svg',
      label: 'Surveillance',
      link: 'surveilience',
      hasChild: false,
      // isOpen: false,
      // children: [
      //   { icon: 'fas fa-user', label: 'Profile' },
      //   { icon: 'fas fa-lock', label: 'Security' },
      // ]
    },
    {
      icon: './assets/img/icon_parking.svg',
      activeIcon: './assets/img/icon_parking1.svg',
      label: 'Parking',
      link: 'parking',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_ATCS.svg',
      activeIcon: './assets/img/icon_ATCS1.svg',
      label: 'ATCS',
      link: 'atcs',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_airQuality.svg',
      activeIcon: './assets/img/icon_airQuality1.svg',
      label: 'Air Quality',
      link: 'air',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_alerts.svg',
      activeIcon: './assets/img/icon_alerts1.svg',
      label: 'Alerts',
      link: 'alerts',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_SOPs.svg',
      activeIcon: './assets/img/icon_SOPs1.svg',
      label: 'SOPs',
      link: '#',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_Chat.svg',
      activeIcon: './assets/img/icon_Chat1.svg',
      label: 'Chat',
      link: 'chat',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_settings.svg',
      activeIcon: './assets/img/icon_settings1.svg',
      label: 'Settings',
      link: 'setting',
      hasChild: false,
    },
    {
      icon: './assets/img/icon_settings.svg',
      activeIcon: './assets/img/icon_settings1.svg',
      label: 'Admin',
      link: '',
      hasChild: true,
      children: [
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Project Configuration',
          link: 'admin/projconfig',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Site Configuration',
          link: 'admin/siteconfig',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Project Field Configuration',
          link: 'admin/projfieldconfig',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Map Configuration',
          link: 'admin/mapconfig',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Zone Configuration',
          link: 'admin/zoneconfig',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'API Playground',
          link: 'admin/apiplayground',
          hasChild: false,
        },
        {
          icon: './assets/img/icon_settings.svg',
          activeIcon: './assets/img/icon_settings1.svg',
          label: 'Rule Engine',
          link: 'admin/ruleengine',
          hasChild: false,
        }
      ]
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
