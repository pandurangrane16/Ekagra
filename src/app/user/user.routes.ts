import { Routes } from "@angular/router";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";

export const UserRoutes: Routes = [
    {
        path: '',
        component: UserDashboardComponent,
        data: {
            title: 'User Dashboard',
            urls: [
                { title: 'Dashboard', url: '/user-dash' },
                { title: 'UserDashboard' },
            ],
        },
    },
    {
        path: 'dashboard',
        component: UserDashboardComponent,
        data: {
            title: 'User Dashboard',
            urls: [
                { title: 'User Dashboard', url: '/user-dash' },
                { title: 'UserDashboard' },
            ],
        },
    },
]