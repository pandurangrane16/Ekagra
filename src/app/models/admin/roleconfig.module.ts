import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class RoleconfigModule { 
    id!: any;
    creationTime!: any;
    creatorUserId!: any;
    lastModificationTime!: any;
    lastModifierUserId!: any;
    isDeleted!: any;
    deleterUserId!: any;
    deletionTime!: any;
    tenantId!: any;
    name!: string;
    displayName!: string;
    IsStatic!: boolean;
    IsDefault!: boolean;
    NormalizedName!: string;
    ConcurrencyStamp!: string; 
    category!:any;
}
