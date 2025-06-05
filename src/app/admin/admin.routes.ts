import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ProjectConfigurationComponent} from "./project-configuration/project-configuration.component";

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
      }
]
