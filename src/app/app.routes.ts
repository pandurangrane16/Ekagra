import { AlertsPageComponent } from './routes/alerts-page/alerts-page.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { SurveiliencePageComponent } from './routes/surveilience-page/surveilience-page.component';
import { AtcsComponent } from './routes/atcs/atcs.component';
import { ParkingComponent } from './routes/parking/parking.component';
import { AirQualityComponent } from './routes/air-quality/air-quality.component';
import { SurveilienceCameraComponent } from './routes/surveilience-camera/surveilience-camera.component';
import { ChatPageComponent } from './routes/chat-page/chat-page.component';
import { SettingPageComponent } from './routes/setting-page/setting-page.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ProjectConfigurationComponent } from './admin/project-configuration/project-configuration.component';
import { UserRoutes } from '../app/user/user.routes';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProjectFieldMapComponent } from './admin/project-field-map/project-field-map.component';
import { BulkUploadComponent } from './admin/bulk-upload/bulk-upload.component';
import { RuleEngineComponent } from './admin/rule-engine/rule-engine.component';
import { ContactConfigurationComponent } from './admin/contact-configuration/contact-configuration.component';
import { ContactConfigurationFormComponent } from './admin/contact-configuration/contact-configuration-form/contact-configuration-form.component';
import { SiteConfigurationComponent } from './admin/site-configuration/site-configuration.component';
import { ProjectFieldConfigurationComponent } from './admin/project-field-configuration/project-field-configuration.component';
import { Component } from '@angular/core';
import { DashRoutesComponent } from './routes/dash-routes/dash-routes.component';
export const routes: Routes = [
      { path: "", component: LoginComponent, },
      { path: "login", component: LoginComponent, },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'surveilience', component: SurveiliencePageComponent },
      { path: 'atcs', component: AtcsComponent },
      { path: 'parking', component: ParkingComponent },
      { path: 'air', component: AirQualityComponent },
      { path: 'alerts', component: AlertsPageComponent },
      { path: 'camera', component: SurveilienceCameraComponent },
      //{ path: 'chat', component: ChatPageComponent },
      { path: 'setting', component: SettingPageComponent },
      //{ path: "**", redirectTo: "dashboard" },
       { path: 'projfieldmap', component: ProjectFieldMapComponent },
      {path:'projconf', component: ProjectConfigurationComponent},
            {path:'BulkUpload', component: BulkUploadComponent},
            {path:'ContactConf', component: ContactConfigurationComponent},
             {path:'contactconfig', component: ContactConfigurationFormComponent},
     {path:'siteconf', component: SiteConfigurationComponent},
    {path:'projfieldconfig',component: ProjectFieldConfigurationComponent},
    {path:'dashroute',component: DashRoutesComponent},
      {
            path: 'admin',
            //  component: AdminDashboardComponent,
            //component: AdminDashboardComponent,
            children: [
                  {
                        path: '',
                        loadChildren: () =>
                              import('../app/admin/admin.routes').then(
                                    (m) => m.AdminRoutes
                              ),
                  },
            ],
      },
      {
            path: 'user',
            children: UserRoutes
      }

];
