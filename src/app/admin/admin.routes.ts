import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ProjectConfigurationComponent } from "./project-configuration/project-configuration.component";
import { SiteConfigurationComponent } from "./site-configuration/site-configuration.component";
import { ProjectFieldConfigurationComponent } from "./project-field-configuration/project-field-configuration.component";
import { ZoneConfigurationComponent } from "./zone-configuration/zone-configuration.component";
import { MapConfigurationComponent } from "./map-configuration/map-configuration.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { SiteMngComponent } from "./site-configuration/site-mng/site-mng.component";
import { ApiPlaygroundComponent } from "./api-playground/api-playground.component";
import { ZoneConfigurationFormComponent } from "./zone-configuration/zone-configuration-form/zone-configuration-form.component";
import { ApiListComponent } from "./api-playground/api-list/api-list.component";
import { LoginComponent } from "../routes/login/login.component";
//import { RuleConfigComponent } from "./rule-engine/rule-config/rule-config.component";
import { ProjectFieldConfigurationFormComponent } from "./project-field-configuration/project-field-configuration-form/project-field-configuration-form.component";
import { ProjectConfigurationFormComponent } from "./project-configuration/project-configuration-form/project-configuration-form.component";
import { MapConfigurationFormComponent } from "./map-configuration/map-configuration-form/map-configuration-form.component";
import { RuleConfigComponent } from "./rule-engine/rule-config/rule-config.component";
import { RuleEngineComponent } from "./rule-engine/rule-engine.component";
//import { ProjectConfigurationComponent} from "./admin-dashboard/project-configuration.component";
import { ContactConfigurationFormComponent } from "./contact-configuration/contact-configuration-form/contact-configuration-form.component";
import { ContactConfigurationComponent } from "./contact-configuration/contact-configuration.component";
import { ProjectFieldMapComponent } from "./project-field-map/project-field-map.component";
import { UserHeirarchyComponent } from "./user-heirarchy/user-heirarchy.component";
import { RuleEngineEditComponent } from "./rule-engine/rule-engine-edit/rule-engine-edit.component";
import { CmQueryBuilderComponent } from "../common/cm-query-builder/cm-query-builder.component";
import { SopflowComponent } from "./sopflow/sopflow.component";
import { SopFormComponent } from "./sop-configuration/sop-form/sop-form.component";
import { SopConfigurationComponent } from "./sop-configuration/sop-configuration.component";
import { RoleConfigListComponent } from "./role-config-list/role-config-list.component";
import { RoleConfigurationComponent } from "./role-config-list/role-configuration/role-configuration.component";
import { UserMappingsComponent } from "./user-mappings/user-mappings.component";
import { RoleActionMappingComponent } from "./role-action-mapping/role-action-mapping.component";
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
    path: 'role-action',
    component: RoleActionMappingComponent,
    data: {
      title: 'Role Action Configuration',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/role-action' },
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
    path: 'sopform',
    component: SopFormComponent,
    data: {
      title: 'Site Configuration',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/sopform' },
        { title: 'Site Configuration' },
      ],
    },
  },
    {
    path: 'sopconfig',
    component: SopConfigurationComponent,
    data: {
      title: 'SOP Configuration',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/sopconfig' },
        { title: 'SOP Configuration' },
      ],
    },
  },
  {
    path: 'siteconfigmng',
    component: SiteMngComponent,
    data: {
      title: 'Site Configuration',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/siteconfigmng' },
        { title: 'Site Configuration' },
      ],
    },
  },
  {
    path: 'zoneform',
    component: ZoneConfigurationFormComponent,
    data: {
      title: 'Zone Configuration form',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/zoneform' },
        { title: 'Zone Configuration form' },
      ],
    },
  },
  {
    path: 'projform',
    component: ProjectConfigurationFormComponent,
    data: {
      title: 'Project Configuration form',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/projform' },
        { title: 'Project Configuration form' },
      ],
    },
  },
  {
    path: 'projfieldform',
    component: ProjectFieldConfigurationFormComponent,
    data: {
      title: 'Project Field Configuration form',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/projfieldform' },
        { title: 'Project Field Configuration form' },
      ],
    },
  },
  {
    path: 'mapform',
    component: MapConfigurationFormComponent,
    data: {
      title: 'Map Configuration form',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/mapform' },
        { title: 'Map Configuration form' },
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
  },
  {
    path: 'apiplayground',
    component: ApiPlaygroundComponent,
    data: {
      title: 'Api Playground',
      urls: [
        { title: 'Api Playground', url: '/admin/apiplayground' },
        { title: 'Api Playground' },
      ],
    },
  },
  {
    path: 'apilist',
    component: ApiListComponent,
    data: {
      title: 'Api List View',
      urls: [
        { title: 'Api List View', url: '/admin/apilist' },
        { title: 'Api List View' },
      ],
    },
  },
  {
    path: 'ruleengine',
    component: RuleConfigComponent,
    data: {
      title: 'Rule Engine',
      urls: [
        { title: 'Rule Engine', url: '/admin/ruleengine' },
        { title: 'Rule Engine' },
      ],
    },
  },
    {
    path: 'ruleenginelist',
    component: RuleEngineComponent,
    data: {
      title: 'Rule Engine',
      urls: [
        { title: 'Rule Engine', url: '/admin/ruleenginelist' },
        { title: 'Rule Engine' },
      ],
    },
  },
{
  path: 'rule_edit/:id',
  component: RuleEngineEditComponent,
  data: {
    title: 'Rule Engine',
    urls: [
      { title: 'Rule Engine', url: '/admin/rule_edit/:id' },
      { title: 'Rule Engine' },
    ],
  },
},
  {
    path: 'contactform',
    component: ContactConfigurationFormComponent,
    data: {
      title: 'Contact Configuration form',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/contactform' },
        { title: 'Contact Configuration form' }
      ]
    }
  },
  {
    path: 'projfieldmap',
    component: ProjectFieldMapComponent,
    data: {
      title: 'Project Filed Map',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/projfieldmap' },
        { title: 'Project Filed Map' }
      ]
    }
  },
  {
    path: 'ContactConf',
    component: ContactConfigurationComponent,
    data: {
      title: 'Contact Configuration',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/ContactConf' },
        { title: 'Contact Configuration' }
      ]
    }
  },
  {
    path: 'userheirarchy',
    component: UserHeirarchyComponent,
    data: {
      title: 'Contact Configuration',
      urls: [
        { title: 'User Heirarchy', url: '/admin/userheirarchy' },
        { title: 'Contact Configuration' }
      ]
    }
  },
  {
    path: 'querybuilder',
    component: CmQueryBuilderComponent,
    data: {
      title: 'Contact Configuration',
      urls: [
        { title: 'User Heirarchy', url: '/admin/userheirarchy' },
        { title: 'Contact Configuration' }
      ]
    }
  },
  {
    path: 'sopflow',
    component: SopflowComponent,
    data: {
      title: 'SOP Process',
      urls: [
        { title: 'SOP Process', url: '/admin/sopflow' },
        { title: 'SOP Process' }
      ]
    }
  },
  {
    path: 'roleconfiguration',
    component: RoleConfigurationComponent,
    data: {
      title: 'Role Configuration',
      urls: [
        { title: 'Role Configuration', url: '/admin/RoleConfigurationComponent' },
        { title: 'Role Configuration' }
      ]
    }
  },
    {
    path: 'roleconfigList',
    component: RoleConfigListComponent,
    data: {
      title: 'Role Configuration list',
      urls: [
        { title: 'Admin Dashboard', url: '/admin/RoleConfigListComponent' },
        { title: 'Role Configuration' },
      ],
    },
  },
  {
    path: 'roleCreation',
    component: RoleConfigurationComponent,
    data: {
      title: 'Role Configuration',
      urls: [
        { title: 'SOP Process', url: '/admin/sopflow' },
        { title: 'SOP Process' }
      ]
    }
  },
  {
    path: 'userMappings',
    component: UserMappingsComponent,
    data: {
      title: 'User Mappings',
      urls: [
        { title: 'SOP Process', url: '/admin/userMappings' },
        { title: 'SOP Process' }
      ]
    }
  }
]
