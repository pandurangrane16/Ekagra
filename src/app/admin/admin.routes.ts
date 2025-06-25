import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ProjectConfigurationComponent} from "./project-configuration/project-configuration.component";
import { SiteConfigurationComponent } from "./site-configuration/site-configuration.component";
import { ProjectFieldConfigurationComponent } from "./project-field-configuration/project-field-configuration.component";
import { ZoneConfigurationComponent } from "./zone-configuration/zone-configuration.component";
import { MapConfigurationComponent } from "./map-configuration/map-configuration.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//import { ProjectConfigurationComponent} from "./admin-dashboard/project-configuration.component";

export const AdminRoutes: Routes = [
    {
      path: '',
     component: AdminDashboardComponent,
      data: {
        title: 'Admin Dashboard',
        urls: [
          { title: 'Dashboard', url: '/user-dash' },
          { title: 'UserDashboard' },
        ],
      },
    },
    {
        path: 'dashboard',
       component: AdminDashboardComponent,
        data: {
          title: 'Admin Dashboard',
          urls: [
            { title: 'Admin Dashboard', url: '/dashboard' },
            { title: 'UserDashboard' },
          ],
        },
      },
      {
        path: 'projconfig',
        component: ProjectConfigurationComponent,
        data: {
          title: 'Project Configuration',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/projconfig' },
            { title: 'Project Configuration' },
          ],
        },
      },
      {
        path: 'siteconfig',
        component: SiteConfigurationComponent,
        data: {
          title: 'Site Configuration',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/siteconfig' },
            { title: 'Site Configuration' },
          ],
        },
      },
      {
        path: 'projfieldconfig',
        component: ProjectFieldConfigurationComponent,
        data: {
          title: 'Project Field Configuration',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/projfieldconfig' },
            { title: 'Project Field Configuration' },
          ],
        },
      },
      {
        path: 'mapconfig',
        component: MapConfigurationComponent,
        data: {
          title: 'Map Configuration',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/mapconfig' },
            { title: 'Map Configuration' },
          ],
        },
      },
      {
        path: 'zoneconfig',
        component: ZoneConfigurationComponent,
        data: {
          title: 'Zone Configuration',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/zoneconfig' },
            { title: 'Zone Configuration' },
          ],
        },
      },
           {
        path: 'bulkupload',
        component: BulkUploadComponent,
        data: {
          title: 'Bulk Upload',
          urls: [
            { title: 'Admin Dashboard', url: '/admin/bulkupload' },
            { title: 'Bulk Upload' },
          ],
        },
      }
]
