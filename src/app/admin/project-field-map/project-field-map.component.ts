import { Component, OnInit,Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
// import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
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
import { JsonTreeComponent } from '../../common/json-tree/json-tree.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';

@Component({
  selector: 'app-project-field-map',
  imports: [
    NgxJsonViewerModule,
    CommonModule,
    // CmTableComponent,
    JsonTreeComponent,
    FormsModule,          // ✅ <-- ADD THIS
    ReactiveFormsModule,  // ✅ <-- (you already had this)
      CmInputComponent,
      // CmSelect2Component,
    AppCustomSelectComponent  ],
  templateUrl: './project-field-map.component.html',
  styleUrl: './project-field-map.component.css',
 providers:[ToastrService]
})

export class ProjectFieldMapComponent implements OnInit{
     loaderService = inject(LoaderService);
  _headerName = 'Project Field Map';
 form!: FormGroup;
  projectOptions: any[] = [];
  apiOptions: any[] = [];
 projectFieldMapData: any[] = [];
 apiJsonData: any = {};
  selectedRowIndex: number | null = null;  // ✅ ADD THIS LINE
showApiDetails: boolean = false;


constructor(
    private fb: FormBuilder,
    private projectService: projconfigservice,
    private fieldMapService: ProjectfieldmapService,
     private toast: ToastrService
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
  try{
  debugger;
    this.projectService.GetProjectList().pipe(withLoader(this.loaderService)).subscribe((response: any)=> { console.log(response);
      this.projectOptions = (response.result || []).map((item: any) => ({
        name: item.name || item.shortCode,
        value: item.id
      }));
    });
    } catch (ex) {
    console.error('Client-side JS error:', ex);
  }
  }
onProjectSelected(selectedProject: any) {

try{ 
  //  debugger;
  //   console.log('Selected Project:', selectedProject);
  //   if (selectedProject && selectedProject.value) {
  //     this.loadApiListByProject(selectedProject.value);
  //   }

   debugger;
    console.log('Selected Project:', selectedProject);

    // ✅ If no project selected or '--select--', reload page
    if (
      !selectedProject || 
      !selectedProject.value || 
      selectedProject.value === '' || 
      selectedProject.value === '--select--'
    ) {
      console.warn('Invalid or empty project selected. Reloading page...');
      window.location.reload();
      return;
    }

    // ✅ Otherwise, load API list for selected project
    this.loadApiListByProject(selectedProject.value);
    
    } catch (ex) {
    console.error('Client-side JS error:', ex);
  }
  }
loadApiListByProject(projectId: number) {
  debugger;
  try {
    this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAllTypes(projectId).pipe(withLoader(this.loaderService)).subscribe({
      next: (response:any) => {
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

//   onApiSelected(selectedApi: any) {
//   debugger;
//   try{
//   console.log('Selected API:', selectedApi);

//   if (selectedApi && selectedApi.value) {
//     this.loadApiDetails(selectedApi.value);
//   }
//   } catch (ex) {
//     console.error('Client-side JS error:', ex);
//   }
// }
onApiSelected(selectedApi: any) {
  debugger;
  try{
    if (selectedApi && selectedApi.value) {
      this.showApiDetails = true; 
      this.loadApiDetails(selectedApi.value);
    } else {
      this.showApiDetails = false; // Optional: hide if no API selected
    }
    // if (selectedApi && selectedApi.value) {
    //   this.loadApiDetails(selectedApi.value);
    //   }
  // this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAPI(selectedApi.value).subscribe({
  //   next: (response) => {
  //     const apiData = response.result[0];
  //     try {
  //       this.apiJsonData = JSON.parse(apiData.response);
  //     } catch (e) {
  //       console.error('Invalid JSON:', e);
  //       this.apiJsonData = {};
  //     }
  //   }
  // });
}
 catch (ex) {
    console.error('Client-side JS error:', ex);
  }

}


// loadApiDetails(apiId: number) {
//   debugger;
//   // Show loading spinner
//   // Example: this.spinnerService.show();
//   this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAPI(apiId).subscribe({
//     next: (response) => {
//       if (response.result && response.result.length > 0) {
//         const apiData = response.result[0];

//         // Bind API Name, URL, and Response
//         document.getElementById('api_name_label')!.innerHTML = 'API NAME :';
//         document.getElementById('api_url_label')!.innerHTML = 'API URL :';
//         document.getElementById('api_response_label')!.innerHTML = 'RESPONSE :';

//         // document.getElementById('apiName')!.innerHTML = apiData.apiName;
//         // document.getElementById('apiURL')!.innerHTML = apiData.baseURL;
//         this.form.get('apiName')?.setValue(apiData.apiName);
// this.form.get('apiURL')?.setValue(apiData.baseURL);
// this.form.get('apiResponse')?.setValue(JSON.parse(apiData.response || '{}'));

//      this.form.get('apiName')?.setValue('anup');
// try {
//   let jsonData = JSON.parse(apiData.response || '{}');
//   console.log('API JSON Response:', jsonData);
// } catch (e) {
//   console.error('Invalid JSON:', e);
// }
//         // try {
//         //   let jsonData = JSON.parse(apiData.response || '{}');
//         //   console.log('API JSON Response:', jsonData);

//         //   // Example: Bind jsonData as formatted text (you can integrate JSON tree viewers here)
//         //    document.getElementById('apiResponse')!.innerText = JSON.stringify(jsonData, null, 2);

//         // } catch (e) {
//         //   console.error('Invalid JSON response:', e);
//         // }

//         const projectId = this.form.value.selectedProject;
//         if (projectId) {
//           this.loadProjectFieldMap(projectId, apiId);
//         }
//       } else {
//         alert('API details not found');
//       }
//     },
//     error: (error) => {
//       console.error('API Details Load Error:', error);
//     },
//     complete: () => {
//       // Hide spinner
//       // this.spinnerService.hide();
//     }
//   });
// }


// loadApiDetails(apiId: number) {
//   debugger;
//   this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAPI(apiId).subscribe({
//     next: (response) => {
//       if (response.result && response.result.length > 0) {
//         const apiData = response.result[0];

//         this.form.get('apiName')?.setValue(apiData.apiName);
//         this.form.get('apiURL')?.setValue(apiData.baseURL);

//         try {
//           const jsonData = JSON.parse(apiData.response || '{}');
//           console.log('API JSON Response:', jsonData);

//           // ✅ Set JSON as formatted string (for textarea display)
//           this.form.get('apiResponse')?.setValue(JSON.stringify(jsonData, null, 2));

//         } catch (e) {
//           console.error('Invalid JSON:', e);
//           this.form.get('apiResponse')?.setValue(apiData.response);  // fallback to raw string
//         }

//         const projectId = this.form.value.selectedProject;
//         if (projectId) {
//           this.loadProjectFieldMap(projectId, apiId);
//         }
//       } else {
//         alert('API details not found');
//       }
//     },
//     error: (error) => {
//       console.error('API Details Load Error:', error);
//     }
//   });
// }
loadApiDetails(apiId: number) {
debugger;

  try {  this.fieldMapService.GetActiveProjectFieldMasterByProjectidForAPI(apiId).pipe(withLoader(this.loaderService)).subscribe({
    next: (response:any) => {
      if (response.result && response.result.length > 0) {
        const apiData = response.result[0];

        this.form.get('apiName')?.setValue(apiData.apiName);
        this.form.get('apiURL')?.setValue(apiData.baseURL);
// this.form.get('apiName')?.disable();
// this.form.get('apiURL')?.disable();
        try {
          this.apiJsonData = JSON.parse(apiData.response || '{}');
          console.log(apiData.response+'- apiData.response');
        } catch (e) {
          console.error('Invalid JSON:', e);
          this.apiJsonData = {};
        }

        const projectId = this.form.value.selectedProject;
        if (projectId) {
          this.loadProjectFieldMap(projectId, apiId);
        }
      }
    }
  });
  } catch (ex) {
    console.error('Client-side JS error:', ex);
  }
}

// onJsonPathSelected(event: any) {
//     try {
//   const selectedPath = event.detail?.path || '';
//   console.log('Selected JSON Path:', selectedPath);
//   } catch (ex) {
//     console.error('Client-side JS error:', ex);
//   }
// }



// onJsonPathSelected(jsonPath: string) {
//   debugger;

//   if (this.selectedRowIndex !== null) {
//     console.log('Selected JSON Path:', jsonPath);

//     // Assign JSON path to the row's apiField
//     this.projectFieldMapData[this.selectedRowIndex].apiField = jsonPath;

//     // Get the value from API response at this path
//     const value = this.getValueByPath(this.apiJsonData, jsonPath);

//     // Detect type
//     let detectedType = 'Unknown';
//     if (Array.isArray(value)) {
//       if (value.length > 0) {
//         const firstType = typeof value[0];
//         detectedType = `List of ${this.mapType(firstType)}`;
//       } else {
//         detectedType = 'List (Empty)';
//       }
//     } else {
//       detectedType = this.mapType(typeof value);
//     }

//     // Assign type
//     this.projectFieldMapData[this.selectedRowIndex].fieldType = detectedType;
//     // this.filepath = detectedType;

//     console.log('Value:', value);
//     console.log('Detected Type:', this.projectFieldMapData[this.selectedRowIndex].fieldType);

//     this.selectedRowIndex = null; // Reset after setting
//   }
// }

// private mapType(type: string): string {
//   const typeMap: Record<string, string> = {
//     string: 'string',
//     number: 'integer',
//     boolean: 'boolean',
//     object: 'object',
//     undefined: 'undefined',
//     integer: 'integer',
//   };
//   return typeMap[type] || 'Unknown';
// }


// onJsonPathSelected(jsonPath: string) {
//   debugger;

//   if (this.selectedRowIndex !== null) {
//     console.log('Selected JSON Path:', jsonPath);

//     // Assign JSON path to the row's apiField
//     this.projectFieldMapData[this.selectedRowIndex].apiField = jsonPath;

//     // Get the value from API response at this path
//     const value = this.getValueByPath(this.apiJsonData, jsonPath);

//     // Detect and normalize type
//     const detectedType = this.detectValueType(value);

//     // Assign type
//     this.projectFieldMapData[this.selectedRowIndex].fieldType = detectedType;

//     console.log('Value:', value);
//     console.log('Detected Type:', detectedType);

//     this.selectedRowIndex = null; // Reset after setting
//   }
// }


onJsonPathSelected(jsonPath: string) {
  debugger;

  if (this.selectedRowIndex !== null) {
    console.log('Original Selected JSON Path:', jsonPath);

    // 🔹 Step 1: Ensure it starts with 'data.' prefix
    if (!jsonPath.startsWith('data.')) {
      jsonPath = 'data.' + jsonPath;
    }

    // 🔹 Step 2: Replace numeric indices with [index]
    // e.g., result.0.id → result.[0].id
    jsonPath = jsonPath.replace(/\.([0-9]+)(\.|$)/g, '.[$1]$2');

    console.log('Normalized JSON Path:', jsonPath);

    // 🔹 Step 3: Assign normalized path to the selected row
    this.projectFieldMapData[this.selectedRowIndex].apiField = jsonPath;

    // 🔹 Step 3: Extract the final property name (e.g., sopName)
    const lastPropertyMatch = jsonPath.match(/\.?([a-zA-Z0-9_]+)\]?$/);
    const lastProperty = lastPropertyMatch ? lastPropertyMatch[1] : '';

    // 🔹 Step 4: Extract value using the normalized path
    // const value = this.getValueByPath(this.apiJsonData, jsonPath);
        const value = this.getValueByPath(this.apiJsonData, lastProperty);

    // 🔹 Step 5: Detect and assign type
    const detectedType = this.detectValueType(value);
    this.projectFieldMapData[this.selectedRowIndex].fieldType = detectedType;

    console.log('Value:', value);
    console.log('Detected Type:', detectedType);

    this.selectedRowIndex = null; // Reset after setting
  }
}

private detectValueType(value: any): string {
  if (value === null || value === undefined) return 'undefined';

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List (Empty)';
    return `List of ${this.mapType(typeof value[0])}`;
  }

  // Handle primitives and objects
  return this.mapType(typeof value, value);
}

private mapType(type: string, value?: any): string {
  // Normalize PostgreSQL-style or mixed type cases
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'integer',
    boolean: 'boolean',
    object: 'object',
    text: 'string',        // normalize "text" to string
    integer: 'integer',
    undefined: 'undefined'
  };

  // Special handling for IDs that look numeric but are strings
  if (type === 'string' && value && /^\d+$/.test(value)) {
    return 'integer';
  }

  return typeMap[type] || 'Unknown';
}



/**
 * Utility: Extract value from object using dot-separated path
 */
// private getValueByPath(obj: any, path: string): any {
//   return path.split('.').reduce((acc, part) => acc && acc[part], obj);
// }

private getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let acc = obj;

  // ✅ Step 1: if obj has `result` or `data`, go inside it first
  if (acc && (acc.result || acc.data)) {
    acc = acc.result || acc.data;
  }

  // ✅ Step 2: if it's an array, pick the last element
  if (Array.isArray(acc)) {
    acc = acc[acc.length - 1];
  }

  // ✅ Step 3: traverse down using dot notation
  for (const part of parts) {
    if (acc === null || acc === undefined) return undefined;

    if (Array.isArray(acc)) {
      acc = acc[acc.length - 1]; // pick last array element if found
    }

    acc = acc[part];
  }

  // ✅ Step 4: final check if result is array → take last element
  if (Array.isArray(acc)) {
    acc = acc[acc.length - 1];
  }

  return acc;
}

loadProjectFieldMap(projectId: number, apiId: number) {
  debugger;
    try {
  // debugger;
  // this.fieldMapService.projectFieldByProjectIdWithAllType(projectId, apiId).subscribe({
  //   next: (response) => {
  //     const data = response.result || [];
  //     const table = document.getElementById('ProjectFieldMapTable')!.getElementsByTagName('tbody')[0];
  //     table.innerHTML = '';

  //     let row = 1;
  //     data.forEach((item: any) => {
  //       const tr = document.createElement('tr');
  //       // tr.innerHTML = `
  //       //   <td><label>${row}</label></td>
  //       //   <td><input type="text" class="form-control" value="${item.label}" disabled /></td>
  //       //   <td><input type="text" class="form-control" value="${item.apiField}" disabled /></td>
  //       //   <td hidden><input type="text" class="form-control" value="${item.fieldType}" disabled /></td>
  //       //   <td hidden><input type="text" value="${item.id}" /><input type="text" value="${item.projectField}" /></td>
  //       //   <td><button type="button" class="btn btn-dark">Set</button></td>
  //       //   <td><button type="button" class="btn btn-dark">Clear</button></td>
  //       // `;
  //        tr.innerHTML = `
  //         <td><label>${row}</label></td>
  //         <td><input type="text" class="form-control" value="${item.label}" disabled /></td>
  //         <td><input type="text" class="form-control" value="${item.apiField}"  disabled/></td>
  //         <td hidden><input type="text" class="form-control" value="${item.fieldType}" disabled /></td>
  //         <td hidden><input type="text" value="${item.id}" /><input type="text" value="${item.projectField}" /></td>
  //         <td><button type="button" class="btn btn-dark">Set</button></td>
  //         <td><button type="button" class="btn btn-dark">Clear</button></td>
  //       `;

  //       table.appendChild(tr);
  //       row++;
  //     });
  //   },
  //   error: (error) => {
  //     console.error('Field Map Load Error:', error);
  //   }
  // });

   debugger;
  this.fieldMapService.projectFieldByProjectIdWithAllType(projectId, apiId).pipe(withLoader(this.loaderService)).subscribe({
    next: (response:any) => {
      const data = response.result || [];
      this.projectFieldMapData = data;  // ✅ Directly bind the API response to your component array
    },
    error: (error) => {
      console.error('Field Map Load Error:', error);
    }
  });
} catch (ex) {
    console.error('Client-side JS error:', ex);
  }

}


setApiField(index: number) {
  try{
    this.selectedRowIndex = index;
    // alert('Now click a field from API Response to set for this row');
     this.toast.success('Now click a field from API Response to set for this row'); 
  } catch (ex) {
    console.error('Client-side JS error:', ex);
  }
}

clearApiField(index: number) {
  this.projectFieldMapData[index].apiField = '';
}

onSave() {
  try{
    debugger;

    // ✅ Step 0: Check if all apiField values are empty
    const allEmpty = this.projectFieldMapData.every(row => !row.apiField || row.apiField.trim() === '');
    if (allEmpty) {
      console.error('Please set API Fields to save the data');
      this.toast.error('Please set API Fields to save the data');
      // alert('Please enter API Fields to save the data');
      return;
    }

    // ✅ Step 1: Duplicate Check for API Fields
  // Step 1: Duplicate Check for API Fields
  const apiFieldValues = new Set<string>();
  let duplicateFound = false;

  for (const row of this.projectFieldMapData) {
    if (row.apiField && row.apiField.trim() !== '') {
      if (apiFieldValues.has(row.apiField.trim())) {
        duplicateFound = true;
        break;
      }
      apiFieldValues.add(row.apiField.trim());
    }
  }

  if (duplicateFound) {
     this.toast.error('API Field must be mapped only once!');
    // alert('API Field must be mapped only once!');
    return; // Stop further processing
  }
const selectedProjectId = this.form.value.selectedProject;
const selectedProject = this.projectOptions.find(p => p.value === selectedProjectId);
const projectName = selectedProject ? selectedProject.name : '';
  // Step 2: Prepare Payload for API Call
  const updateData = this.projectFieldMapData
  .filter(item => item.apiField && item.apiField.trim() !== '')
  .map(item => ({
    Id: item.id,
    ProjectField: item.projectField,
    APIField: item.apiField,
    ProjectId: Number(this.form.value.selectedProject),
    FieldType: item.fieldType ?? 'Text',  // ✅ <-- Avoid null for FieldType
    ProjectAPIId: Number(this.form.value.selectedApi),
    IsActive: true,
    ProjectName: projectName,
    Label: item.label
  }));

  console.log('Data to Save:', updateData);

  // Step 3: Call API to Save
  if (updateData.length > 0) {
    this.fieldMapService.InsertUpdateBulkProjectFieldQuery(updateData).pipe(withLoader(this.loaderService)).subscribe({
      next: () => {
           console.error('Saved Successfully');
      this.toast.success('Saved Successfully');
        // Reload page or reload project field map
        // Example: this.loadProjectFieldMap(this.form.value.selectedProject, this.form.value.selectedApi);
      },
      error: (error) => {
        console.error('Save failed:', error);
      this.toast.error('Saved failed');
      }
    });
  }
} catch (ex) {
    console.error('Client-side JS error:', ex);
  }
  // this.fieldMapService.insertUpdateBulkProjectFieldQuery(updateData).subscribe({
  //   next: () => {
  //     alert('Saved Successfully');
  //   },
  //   error: (error) noten=> {
  //     console.error('Save failed:', error);
  //   }
  // });
}


}


