import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HeaderService } from '../../services/header.service';
import { MaterialModule } from '../../Material.module';
import { SessionService } from '../../services/common/session.service';


interface MenuItem {
  icon: string;
  activeIcon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  link: string;
  apiLable?: string;
  appendProject?: boolean;
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
    MaterialModule
  ],
  providers: [HeaderService],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  isSidebarCollapsed = true;
  sessionService = inject(SessionService);
  configData: any;
  router = inject(Router);
  @Output() logoShow = new EventEmitter<Event>();
  @Output() sidebarToggle = new EventEmitter<void>();
  @Input()
  set event(event: Event) {
    if (event) {
      this.toggle();
    }
  }
  @Output() eventChange = new EventEmitter<Event>();
 showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  onClick(event: Event) {
    this.eventChange.emit(event);

  }

  constructor(public headerService: HeaderService, public routes: Router, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    
    let _data = this.sessionService._getSessionValue("config");
    console.log(_data ?? '');
    this.configData = _data;
    this.menuItems = [
      // {
      //   icon: './assets/img/icon_dashboard1.svg',
      //   label: 'Dashboard',
      //   link: 'dashboard',
      //   activeIcon: './assets/img/icon_dashboard2.svg',
      //    isOpen: false,
      //   children: [
      //   ]
      // },
      {
          icon: './assets/img/icon_dashboard1.svg',
           activeIcon: './assets/img/icon_dashboard2.svg',
          label: 'Dashboard',
          link: 'dashboard',
        }, {
         icon: './assets/img/VMS.png',
        activeIcon: './assets/img/VMS.png',
          label: 'VMS',
          link: 'vms',
        }, 
        {
          icon: './assets/img/TES.png',
        activeIcon: './assets/img/TES.png',
          label: 'TES',
          link: 'tes',
        }, 
        {
         icon: './assets/img/PA.png',
        activeIcon: './assets/img/PA.png',
          label: 'PA',
          link: 'pa',
        },
      {
        icon: './assets/img/icon_surveillance.svg',
        activeIcon: './assets/img/icon_surveillance1.svg',
        label: 'Surveillance',
        link: 'camera',
        apiLable: "surveilience"
      },
      {
        icon: './assets/img/icon_parking.svg',
        activeIcon: './assets/img/icon_parking1.svg',
        label: 'Parking',
        link: 'parking'
      },
      {
        icon: './assets/img/icon_ATCS.svg',
        activeIcon: './assets/img/icon_ATCS1.svg',
        label: 'ATCS',
        link: 'atcs',
        apiLable: "atcs"
      },
      {
        icon: './assets/img/icon_airQuality.svg',
        activeIcon: './assets/img/icon_airQuality1.svg',
        label: 'Air Quality',
        link: 'air',
      },
      {
        icon: './assets/img/icon_alerts.svg',
        activeIcon: './assets/img/icon_alerts1.svg',
        label: 'Alerts',
        link: 'alerts',
      },
      // {
      //   icon: './assets/img/icon_SOPs.svg',
      //   activeIcon: './assets/img/icon_SOPs1.svg',
      //   label: 'SOPs',
      //   link: '#',
      // },
      // {
      //   icon: './assets/img/icon_Chat.svg',
      //   activeIcon: './assets/img/icon_Chat1.svg',
      //   label: 'Chat',
      //   link: 'chat',
      // },
      // {
      //   icon: './assets/img/icon_settings.svg',
      //   activeIcon: './assets/img/icon_settings1.svg',
      //   label: 'Settings',
      //   link: 'setting',
      // },

      {
        icon: './assets/img/config.png',
        activeIcon: './assets/img/config.png',
        label: 'Config',
        link: '',
        isOpen: false,
        children: [{
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/next.png',
          label: 'Dashboard',
          link: 'admin/dashboard',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/next.png',
          label: 'Project Config',
          link: 'admin/projconfig',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Site Config',
          link: 'admin/siteconfig',
        },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Sop Config',
          link: 'admin/sopconfig',
        },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Project field Config',
          link: 'admin/projfieldconfig',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Zone Config',
          link: 'admin/zoneconfig',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Map Config',
          link: 'admin/mapconfig',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Project Filed Map',
          link: 'admin/projfieldmap',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Contact Config',
          link: 'admin/ContactConf',
        }, {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'API Playground',
          link: 'admin/apilist',
        },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Rule Engine',
          link: 'admin/ruleenginelist',
        },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'User Config',
          link: 'admin/userheirarchy',
        },
        // {
        //   icon: './assets/img/icon_settings.svg',
        //   activeIcon: './assets/img/icon_settings1.svg',
        //   label: 'User Dashboard',
        //   link: 'user/user-dash',
        // },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Role Config',
          link: 'admin/roleconfigList',
        },
          {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'Role Action Mapping',
          link: 'admin/role-action',
        },
        {
          icon: './assets/img/dot.png',
          activeIcon: './assets/img/dot.png',
          label: 'User Mappings',
          link: 'admin/userMappings',
        }]
      }
    ];

  }

 isChildActive(child: any): boolean {
  return this.router.isActive(child.link, {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored'
  });
}

isItemActive(item: any): boolean {
  if (!item.children?.length) {
    return this.isChildActive(item);
  }
  return item.children.some((child: any) => this.isChildActive(child));
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
  menuItems: MenuItem[] = [];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    console.log('toggleMenuItem', item);
    // If item has children, toggle its open state
    if (item.children) {
      item.isOpen = !item.isOpen;
      return;
    }

    // For leaf items, build absolute route and navigate
    try {
      const configRaw = this.sessionService._getSessionValue('config');
      const parsed = configRaw ? JSON.parse(configRaw.toString()) : null;
      const codeObj = parsed?.projectCodes?.find((x: any) => x.name === item.apiLable);
      // Only append project code for routes that are admin pages or explicitly opt-in
      const shouldAppend = codeObj && (item.appendProject === true || item.link.startsWith('admin'));
      const targetRoute = shouldAppend ? `${item.link}/${codeObj.value}` : item.link;
      if (shouldAppend) this.sessionService._setSessionValue('projectIdRoute', codeObj);
      const absolute = targetRoute.startsWith('/') ? targetRoute : `/${targetRoute}`;
      console.log('Navigating to (absolute):', absolute);
      this.router.navigateByUrl(absolute);
    } catch (err) {
      console.error('Navigation error:', err);
      const absolute = item.link.startsWith('/') ? item.link : `/${item.link}`;
      this.router.navigateByUrl(absolute);
    }
  }
}
