import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { CmPaginationComponent } from '../cm-pagination/cm-pagination.component';
import { MatMenuPanel } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cm-table',
  imports: [MaterialModule,CommonModule,CmPaginationComponent],
  templateUrl: './cm-table.component.html',
  styleUrl: './cm-table.component.css'
})
export class CmTableComponent implements OnInit {
  listOfData: any;
    tooltip: string = "";
    searchText: string = "";
    @Input() _headerName:string = "";
    @Input() pagination:boolean =true;
    @Input() isSearch: boolean = false;

    @Output() pager = new EventEmitter<{ type: string; pageNo: number }>();
@Output() recordPerPage = new EventEmitter<{ type: string; perPage: number }>();

   
    @Output() searchWithId = new EventEmitter<any>();
    @Output() search = new EventEmitter<string>();
   
    @Input() headArr: any[] = [];
    @Input() link!: string;
    @Input() isSearchBox: boolean = true;
    @Input() fieldName!: string;
    @Input() gridArr: any[] = [];
    @Input() totalRecords!: number;
    @Input() perPage: number = 10;
    @Input() totalPages: number = 1;
    @Input() collectionSize: number = 1;
    @Input() btnArray: any[] = [];
    filteredData: any = [];
    activePage: number = 0;
    @Output() btnAction = new EventEmitter<any>();
    @Output() checked = new EventEmitter<any>();
    @Output() notChecked = new EventEmitter<any>();
  menu1: MatMenuPanel<any>|null;
    constructor(private router: Router) {
  
    }
    ngOnInit(): void {
      //this.headArr = this.headArr.sort(x=>x.position);
      console.log(this.headArr);
    }
    ngOnChanges(changes: SimpleChanges): void {
      if(!this.isSearch) {
        this.searchText = "";
      }
    }
    displayActivePage(activePageNumber: number) {
      this.activePage = activePageNumber
    }
    Search() {
      if (this.searchText.trim().length > 2) {
        this.search.emit(this.searchText);
      } else if (this.searchText.trim() == "") {
        this.search.emit(this.searchText);
      }
    }
    mouseEnter(msg: string) {
      this.tooltip = msg;
    }
    pageChange(pager: any) {
       this.pager.emit({ type: 'pageChange', pageNo: pager });
    }
  
    onPageChange(pageNo: number) {
      this.pageChange(pageNo);
      
    }
    onPageRecordsChange(pageNo: number) {
     this.recordPerPage.emit({ type: 'perPageChange', perPage: pageNo });
    }
  
    ShowForm(item: any) {
      if (this.btnArray.length == 0)
        this.searchWithId.emit(item);
      //this.router.navigate([this.link]);
    }
    GoToBtnAction(evt:any, data: any) {
      let _sendData = {"event":evt, "data": data };
      this.btnAction.emit(_sendData);
    }
    Checked(eve: any, data: any) {
      if (eve.target.checked == true)
        this.checked.emit(data);
      else
        this.notChecked.emit(data);
    }
  }
