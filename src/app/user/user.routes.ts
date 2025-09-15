import { Routes } from "@angular/router";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { CustomCompCreateComponent } from "./custom-comp-create/custom-comp-create.component";
import { Chart3dComponent } from "./chart3d/chart3d.component";
import { UserDashComponent } from "./user-dash/user-dash.component";
import { AlertComponent } from "./alert/alert/alert.component";
import { SopflowComponent } from "../admin/sopflow/sopflow.component";

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
        path: 'user-dash',
        component: UserDashComponent,
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
    {
        path: '3d',
        component: Chart3dComponent,
        data: {
            title: 'Custom Widget',
            urls: [
                { title: 'Custom Widget', url: '/3d' },
                { title: 'UserDashboard' },
            ],
        },
    },
    {
        path: 'alert',
        component: AlertComponent,
        data: {
            title: 'Custom Widget',
            urls: [
                { title: 'Custom Widget', url: '/3d' },
                { title: 'UserDashboard' },
            ],
        },
    },
    {
        path: 'sopflow',
        component: SopflowComponent,
        data: {
            title: 'Custom Widget',
            urls: [
                { title: 'Custom Widget', url: '/3d' },
                { title: 'UserDashboard' },
            ],
        },
    },
]