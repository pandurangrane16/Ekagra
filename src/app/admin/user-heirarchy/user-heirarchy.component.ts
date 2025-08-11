import { Component, inject, OnInit } from '@angular/core';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../Material.module';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-heirarchy',
  imports: [CmSelect2Component, ReactiveFormsModule, MaterialModule, CmTableComponent, CommonModule],
  templateUrl: './user-heirarchy.component.html',
  styleUrl: './user-heirarchy.component.css'
})
export class UserHeirarchyComponent implements OnInit {
  headerArr: any;
  totalPages: any = 0;
  totalRecords: any = 0;
  perPage: any = 0;
  userTypeSettings: any;
  isUserLoaded: boolean = false;
  isManagerLoaded: boolean = false;
  managerSettings: any;
  form: any;
  fb = inject(FormBuilder);
  openDialog() { }
  onUserTypeSelected(evt: any) { }
  onManagerSelected(evt: any) { }
  onPageChange(evt: any) { }
  onRowClicked(evt: any) { }
  onButtonClicked(evt: any) { }
  onPageRecordsChange(evt: any) { }
  items: any;
  headArr: any;
  collectionSize: any;


  ngOnInit(): void {
    this.isUserLoaded = true;
    this.userTypeSettings = {
      labelHeader: 'Select User',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [{ name: "Pandurang", value: "0" }, { name: "Shridhar", value: "1" }, { name: "Ashutosh", value: "2" },
      { name: "Sujit", value: "3" }, { name: "Anup", value: "4" }, { name: "Pralesh", value: "5" }
      ]
    };
      this.managerSettings = {
      labelHeader: 'Select Manager',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [{ name: "Pandurang", value: "0" }, { name: "Shridhar", value: "1" }, { name: "Ashutosh", value: "2" },
      { name: "Sujit", value: "3" }, { name: "Anup", value: "4" }, { name: "Pralesh", value: "5" }
      ]
    };

    this.form = this.fb.group({
      userName: ['', Validators.required],
      manager: [''],
    })
  }

}
