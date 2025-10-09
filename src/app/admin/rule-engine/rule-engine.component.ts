import { Component,inject } from '@angular/core';
import { ProjectConfigurationFormComponent } from '../project-configuration/project-configuration-form/project-configuration-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RuleEngineService } from '../../services/admin/rule-engine.service';
import { InputRequest } from '../../models/request/inputreq.model';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-rule-engine',
   standalone: true,
  imports: [CmTableComponent,CmSelect2Component,CommonModule,MatCardModule,CmInputComponent],
  templateUrl: './rule-engine.component.html',
  styleUrl: './rule-engine.component.css'
})
export class RuleEngineComponent {
  router = inject(Router);
 loaderService=inject(LoaderService)
      _headerName = 'Rule Engine';
      headArr: any[] = [];
      items:any;
      _request: any = new InputRequest();
      totalPages: number = 1;
      pager: number = 0;
      totalRecords!: number;
      recordPerPage: number = 10;
      startId!: number;
      isSearch: boolean = false;
      closeResult!: string;
      searchText!:string;
      selectedProject: any;
      selectedStatus: any;
      form!: FormGroup;
      perPage = 10;
          
    
        MaxResultCount=10;
  SkipCount=0;
  
  pageNo=0;
      collectionSize = 2;
      list!:any;
      isPolicyLoaded = false;
    
      policySelectSettings = {
          labelHeader: 'Select Policy',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
         userGroupSettings = {
    labelHeader: 'User Group*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: []
  };
      statusSelectSettings = {
        labelHeader: 'Select Status',
          lableClass: 'form-label',
          formFieldClass: 'w-100',
          appearance: 'fill',
          options: [
            { name: 'Enable', value: true },
            { name: 'Disable', value: false },
            { name: 'All', value: null }
          ]
        };
      searchInputSettings = {
          labelHeader: 'Search',
          placeholder: 'Type to search...',
          formFieldClass: '', 
          labelClass: 'form-label',
          appearance: 'fill',
          isDisabled: false,
          color: 'primary'
        };
      squareSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-square-input',
        
          isDisabled: false
        };
        
      roundedSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-pill-input',
          appearance: 'fill',
          isDisabled: false
        };

          categorySelectSettings = {
    labelHeader: 'Select Category*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Low', value: '0' },
      { name: 'Medium', value: '1' },
      { name: 'High', value: '2' }
    ],

  };

      constructor(private fb: FormBuilder,
        private dialog: MatDialog,
        private service: RuleEngineService,
        ) {}
        
        
      ngOnInit(): void {
          this.form = this.fb.group({
            policyname: [''],
           
            searchText: ['']
          });
          this.buildHeader();
          this.getRoles();
         // this.getFilteredList();
          this.getProjList();


                      this.form.get('searchText')?.valueChanges
                        .pipe(
                          debounceTime(300), 
                          distinctUntilChanged() 
                        )
                        .subscribe(value => {
                             if (value && value.length >= 3) {
                                 this.perPage=10;
                           this.pager=0;
                          this.getFilteredList();
                        } else if (!value || value.length === 0) {
          
                           this.perPage=10;
                           this.pager=0;
                           this.getFilteredList();
                        }
                        });
       
        }


         getFilteredList() {
    const selectedProjectId = this.form.controls['policyname'].value.value;
    
     const search = this.form.controls['searchText'].value
        this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
 
     this.service.GetFilteredList(selectedProjectId,search,this.MaxResultCount,this.SkipCount).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;
           const totalCount=response.result?.totalCount;


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.name = element.policyName;
            element.isActive = !!element.isActive; 
            element.interval = element.intervalTime;
           


            const matched = (this.categorySelectSettings.options as { name: string; value: any }[])
  .find(opt => String(opt.value) === String(element.category));

element.category2 = matched ? matched.name : element.category;

const matchedUserGroup = (this.userGroupSettings.options as { name: string; value: any }[])
    .find(opt => String(opt.value) === String(element.userGroup));
  element.usergroup = matchedUserGroup ? matchedUserGroup.name : element.userGroup;


           
       
            
              element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    
  ];




                  });
              var _length = totalCount / Number(this.recordPerPage);
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = Number(this.recordPerPage) * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = totalCount;
          this.totalPages = this.totalRecords / this.pager;
        }
      })
    }  
         submit(){
          this.pager=0;
          this.perPage=10;
  this.getFilteredList();
 }
      onProjectChange(value: any) {
          this.selectedProject = value;
          console.log('Selected Project:', value);
          // Apply filtering or logic here
        }

      onStatusChange(value: any) {
          this.selectedStatus = value;
          console.log('Selected Status:', value);
          // Apply filtering or logic here
        }

      onProjectSelected(event: any) {
          console.log('Selected Project:', event);
        }
              openDialog() {
      this.router.navigate(['/admin/ruleengine']);   
          
}
        buildHeader() {  
          this.headArr = [
            { header: 'Policy Name', fieldValue: 'name', position: 1 },
            { header: 'User Group', fieldValue: 'usergroup', position: 2 },
            { header: 'Category', fieldValue: 'category2',position: 3 },
           
            { header: 'Interval (Minutes)', fieldValue: 'interval', position: 4 },
            { header: 'Status', fieldValue: 'isActive',"type": "boolean", position: 5 },
            { header: 'Action', fieldValue: 'button', position: 6 }
          ];
          ;}
      
        handleBtnAction(e: any) {
          console.log('Button Action:', e);
        }
      
        handlePageChange(pageno: number) {
          console.log('Page Changed to:', pageno);
        }
      
        handlePerPageChange(records: number) {
          console.log('Records Per Page:', records);
        }
      
        handleSearchWithId(item: any) {
          console.log('Row clicked:', item);
        }
      
        handleSearch(term: string) {
          console.log('Search term:', term);
        }

          onPageChange(event:any) {
    console.log(event);
  if (event.type === 'pageChange') {
    this.pager = event.pageNo;
  this.getFilteredList();
  }
}

  getRoles() {
   // console.log(this.userOptionsLoaded)
    this.service.GetRolesOnId().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      console.log(response.result)
      const items = response?.result || [];
      console.log(items);

      const itemArray = items.items;

      let projectOptions: any;
      if (Array.isArray(itemArray)) {
        projectOptions = itemArray.map(item => ({
          name: item.displayName,
          value: item.id
        }));
      }


      this.userGroupSettings.options = projectOptions;
      console.log("h4", this.userGroupSettings.options)



      //this.userOptionsLoaded = true;
       this.getFilteredList();
    }, error => {
      console.error('Error fetching project list', error);
    });
  }
onPageRecordsChange(event:any ) {
  console.log(event);
  if (event.type === 'perPageChange') {
    this.perPage = event.perPage;
    this.pager = 0;
    this.getFilteredList();
  }
}


onPaginationChanged(event: { pageNo: number; perPage: number }) {
  if (this.perPage !== event.perPage) {
    this.perPage = event.perPage;
    this.pager = 0; 
  } else {
    this.pager = event.pageNo;
  }

  this.getFilteredList(); 
}




       
        onRowClicked(row: any) {
                console.log('Row clicked:', row);
               }
            
          onButtonClicked({ event, data }: { event: any; data: any }) {
  if (event.type === 'edit') {
    this.editRow(data);
    console.log(data);
  } 
  
  // else if (event.type === 'delete') {
  //   this.deleteRow(data);
  // }
}

editRow(rowData: any) {
  const url = `/admin/rule_edit/${rowData.id}`;
  console.log('Navigating to URL:', url); 

  this.router.navigate([url], {
    state: {
      mode: 'edit'
    }
  });
}
        

    //     getProjConfigList() {
    //   this._request.currentPage = this.pager;
    //   this._request.pageSize = Number(this.recordPerPage);
    //   this._request.startId = this.startId;
    //   this._request.searchItem = this.searchText;
    //   this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((response:any) => {

    //      const items = response.result?.items;
         
    //      this.items=items;







    //     if (Array.isArray(items)) {
         
    //        items.forEach((element: any) => {
           

    //         //let _data = JSON.parse(element);
    //         element.name = element.name;
    //         element.description = element.description;
    //         element.isActive = !!element.isActive; 
    //         element.ruleEngine = !!element.ruleEngine;
    //         element.map =!! element.map;

            




         
    //       });
    //       // var _length = data.totalCount / Number(this.recordPerPage);
    //       // if (_length > Math.floor(_length) && Math.floor(_length) != 0)
    //       //   this.totalRecords = Number(this.recordPerPage) * (_length);
    //       // else if (Math.floor(_length) == 0)
    //       //   this.totalRecords = 10;
    //       // else
    //       //   this.totalRecords = data.totalRecords;
    //       // this.totalPages = this.totalRecords / this.pager;
    //       //this.getMediaByStatus(this.tabno);
    //     }
    //   })
    // }       
       
  getProjList() {
  this.service.GetPolicyList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    const items = response?.result || [];

 
    const projectOptions = items.map((item: any) => ({
      name: item.policyName,
      value: item.id
    }));


        projectOptions.unshift({
      name: 'All',
      value: null
    });

    this.policySelectSettings.options = projectOptions;
this.form.controls['policyname'].setValue({
  name: 'All',
  value: null
});

 
    this.policySelectSettings.options = projectOptions;
    this.isPolicyLoaded = true;
  }, (error:any) => {
    console.error('Error fetching policy list', error);
  });
}
     
       

      
    
}