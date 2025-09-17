import { Component, OnInit } from '@angular/core';
import { CmTableComponent } from '../../../../common/cm-table/cm-table.component';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';

@Component({
  selector: 'app-addressbook',
  imports: [CmTableComponent, MaterialModule, CommonModule, CmInputComponent],
  templateUrl: './addressbook.component.html',
  styleUrl: './addressbook.component.css',
  standalone : true
})
export class AddressbookComponent implements OnInit{
  
  headArr: any;
  items: any;
  form: FormGroup;
  totalPages: number = 1;
  pager: number = 1;
  MaxResultCount = 10;
  SkipCount = 0;
  perPage = 10;
  pageNo = 0;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  isSearch: boolean = false;
  collectionSize = 2;
  squareSettings = {
    labelHeader: 'Search',
    formFieldClass: 'cm-square-input',
    placeholder: 'Search (minimum 3 letters)',
    appearance: 'outline',
    isDisabled: false
  };
constructor(private fb :FormBuilder) {}
  ngOnInit(): void {
    this.buildHeader();
    let items = [{
      "name" : "Pandurang",
      "contact" : "9702944837"
    },{
      "name" : "Shridhar",
      "contact" : "9702944837"
    },{
      "name" : "Sujit",
      "contact" : "9702944837"
    },{
      "name" : "Ashutosh",
      "contact" : "9702944837"
    },{
      "name" : "Anup",
      "contact" : "9702944837"
    },{
      "name" : "Harshita",
      "contact" : "9702944837"
    }]
    this.items = items;

    this.form = this.fb.group({
      searchText : ['']
    })
  }
  onButtonClicked($event: any) {

  }
  onRowClicked($event: any) {

  }
  onPageRecordsChange($event: { type: string; perPage: number; }) {

  }
  onPageChange($event: { type: string; pageNo: number; }) {

  }


  buildHeader() {
    this.headArr = [
      { header: 'Name', fieldValue: 'name', position: 1 },
      { header: 'Contact', fieldValue: 'contact', position: 2 },
      { header: 'Action', fieldValue: 'check', position: 3 }
    ];
    ;
  }

  SubmitAction() {

  }
  CancelAction() {

  }
}
