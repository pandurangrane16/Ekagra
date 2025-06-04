import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

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
]
