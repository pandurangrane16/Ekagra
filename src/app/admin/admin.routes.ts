import { Routes } from "@angular/router";

export const AdminRoutes: Routes = [
    {
      path: '',
     // component: UserDashboardComponent,
      data: {
        title: 'UserDashboard',
        urls: [
          { title: 'Dashboard', url: '/user-dash' },
          { title: 'UserDashboard' },
        ],
      },
    },
    {
        path: 'dashboard',
       // component: UserDashboardComponent,
        data: {
          title: 'Admin Dashboard',
          urls: [
            { title: 'Admin Dashboard', url: '/dashboard' },
            { title: 'UserDashboard' },
          ],
        },
      },
]
