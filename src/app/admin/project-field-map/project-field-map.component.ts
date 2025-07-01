import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { InputRequest } from '../../models/request/inputreq.model';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { ProjectfieldmapService } from '../../services/admin/projectfieldmap.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCustomSelectComponent } from '../../common/custom-select/custom-select.component';

@Component({
  selector: 'app-project-field-map',
  imports: [ CommonModule,
      // CmTableComponent,
      CmInputComponent,
      CmSelect2Component,
    AppCustomSelectComponent  ],
  templateUrl: './project-field-map.component.html',
  styleUrl: './project-field-map.component.css'
})

export class ProjectFieldMapComponent implements OnInit{
 form!: FormGroup;
  projectOptions: any[] = [];
  apiOptions: any[] = [];
 
constructor(
    private fb: FormBuilder,
    private projectService: projconfigservice,
    private fieldMapService: ProjectfieldmapService
  ) {}

 ngOnInit(): void {
    this.form = this.fb.group({
      selectedProject: [''],
      selectedApi: [''],
        apiName: [''],
  apiURL: [''],
  apiResponse: ['']
    });



    this.loadProjectList();
  }
  apiResponseSetting = {
  label: 'API Response',
  placeholder: 'Enter API Response',
  type: 'textarea' // Example, depends on your input component needs
}
 apiURLSetting = {
  label: 'API URL',
  placeholder: 'Enter API Response',
  type: 'text' // Example, depends on your input component needs
};
 apiNameSetting = {
  label: 'API Name',
  placeholder: 'Enter API Response',
  type: 'text' // Example, depends on your input component needs
};
 loadProjectList() {
  debugger;
    this.projectService.GetProjectList().subscribe(response => { console.log(response);
      this.projectOptions = (response.result || []).map((item: any) => ({
        name: item.name || item.shortCode,
        value: item.id
      }));
    });
  }
onProjectSelected(selectedProject: any) {
  debugger;
    console.log('Selected Project:', selectedProject);
    if (selectedProject && selectedProject.value) {
      this.loadApiListByProject(selectedProject.value);
    }
  }
loadApiListByProject(projectId: number) {
  debugger;
  try {
    this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAllTypes(projectId).subscribe({
      next: (response) => {
        this.apiOptions = (response.result || []).map((item: any) => ({
          name: item.apiName,
          value: item.id
        }));
      },
      error: (error) => {
        console.error('Error while loading API list:', error);
      }
    });
  } catch (ex) {
    console.error('Client-side JS error:', ex);
  }
}

  onApiSelected(selectedApi: any) {
  debugger;
  console.log('Selected API:', selectedApi);

  if (selectedApi && selectedApi.value) {
    this.loadApiDetails(selectedApi.value);
  }
}
loadApiDetails(apiId: number) {
  debugger;
  // Show loading spinner
  // Example: this.spinnerService.show();
  this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAPI(apiId).subscribe({
    next: (response) => {
      if (response.result && response.result.length > 0) {
        const apiData = response.result[0];

        // Bind API Name, URL, and Response
        document.getElementById('api_name_label')!.innerHTML = 'API NAME :';
        document.getElementById('api_url_label')!.innerHTML = 'API URL :';
        document.getElementById('api_response_label')!.innerHTML = 'RESPONSE :';

        // document.getElementById('apiName')!.innerHTML = apiData.apiName;
        // document.getElementById('apiURL')!.innerHTML = apiData.baseURL;
        this.form.get('apiName')?.setValue(apiData.apiName);
this.form.get('apiURL')?.setValue(apiData.baseURL);
this.form.get('apiResponse')?.setValue(apiData.response);

     this.form.get('apiName')?.setValue('anup');
try {
  let jsonData = JSON.parse(apiData.response || '{}');
  console.log('API JSON Response:', jsonData);
} catch (e) {
  console.error('Invalid JSON:', e);
}
        // try {
        //   let jsonData = JSON.parse(apiData.response || '{}');
        //   console.log('API JSON Response:', jsonData);

        //   // Example: Bind jsonData as formatted text (you can integrate JSON tree viewers here)
        //    document.getElementById('apiResponse')!.innerText = JSON.stringify(jsonData, null, 2);
   
        // } catch (e) {
        //   console.error('Invalid JSON response:', e);
        // }

        const projectId = this.form.value.selectedProject;
        if (projectId) {
          this.loadProjectFieldMap(projectId, apiId);
        }
      } else {
        alert('API details not found');
      }
    },
    error: (error) => {
      console.error('API Details Load Error:', error);
    },
    complete: () => {
      // Hide spinner
      // this.spinnerService.hide();
    }
  });
}

loadProjectFieldMap(projectId: number, apiId: number) {
  debugger;
  this.fieldMapService.projectFieldByProjectIdWithAllType(projectId, apiId).subscribe({
    next: (response) => {
      const data = response.result || [];
      const table = document.getElementById('ProjectFieldMapTable')!.getElementsByTagName('tbody')[0];
      table.innerHTML = '';

      let row = 1;
      data.forEach((item: any) => {
        const tr = document.createElement('tr');
        // tr.innerHTML = `
        //   <td><label>${row}</label></td>
        //   <td><input type="text" class="form-control" value="${item.label}" disabled /></td>
        //   <td><input type="text" class="form-control" value="${item.apiField}" disabled /></td>
        //   <td hidden><input type="text" class="form-control" value="${item.fieldType}" disabled /></td>
        //   <td hidden><input type="text" value="${item.id}" /><input type="text" value="${item.projectField}" /></td>
        //   <td><button type="button" class="btn btn-dark">Set</button></td>
        //   <td><button type="button" class="btn btn-dark">Clear</button></td>
        // `;
         tr.innerHTML = `
          <td><label>${row}</label></td>
          <td><input type="text" class="form-control" value="${item.label}" disabled /></td>
          <td><input type="text" class="form-control" value="${item.apiField}"  disabled/></td>
          <td hidden><input type="text" class="form-control" value="${item.fieldType}" disabled /></td>
          <td hidden><input type="text" value="${item.id}" /><input type="text" value="${item.projectField}" /></td>
          <td><button type="button" class="btn btn-dark">Set</button></td>
          <td><button type="button" class="btn btn-dark">Clear</button></td>
        `;

        table.appendChild(tr);
        row++;
      });
    },
    error: (error) => {
      console.error('Field Map Load Error:', error);
    }
  });
}


       
}


