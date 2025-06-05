import { Routes } from "@angular/router";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { CustomCompCreateComponent } from "./custom-comp-create/custom-comp-create.component";

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
    {
        path: 'customcomp',
        component: CustomCompCreateComponent,
        data: {
            title: 'Custom Widget',
            urls: [
                { title: 'Custom Widget', url: '/customcomp' },
                { title: 'UserDashboard' },
            ],
        },
    },
]