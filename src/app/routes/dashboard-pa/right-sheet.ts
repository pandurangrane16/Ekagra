import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { FormsModule } from '@angular/forms';
import {CommonService} from '../../services/common/common.service';
import { SessionService } from '../../services/common/session.service';

@Component({
  selector: 'app-right-sheet',
  templateUrl: './right-sheet.html',
  styleUrl: './right-sheet.css',
  
  imports: [CommonModule, MatFormField, MatSelect, MatOption, MatButtonModule, MatCheckbox, MatIcon, MatHint, MatLabel,MatFormFieldModule,
    MatInputModule,
    MatIconModule,MatTabsModule ,MatIconModule, FormsModule 
    ]
})
export class RightSheetComponent implements OnInit {
links = [
  // { label: 'Live', icon: 'campaign' },
  { label: 'Recorded File', icon: 'settings_voice' },
  // { label: 'Uploaded File', icon: 'upload' }
];
activeLink = this.links[0]; // default tab
innerlinks = ['PA', 'Zone'];
public selectedAudio: string = '';
public audioSettings: any = {
    options: []
  };

 

  // Flag to track if the API call finished
  public isAudioLoaded: boolean = false;
activeInnerlink = this.innerlinks[0]; // default tab
selectedFileName = '';
_common = inject(CommonService);
public commaSeparatedSiteNames: string = '';

// Zone Props
ZoneOptions: any[] = [];
selectedZones: any[] = [];
 session = inject(SessionService);
 projectId: number = 0;
 selectedZoneIds: number[] = [];
loaderService = inject(LoaderService);

constructor(private service: atcsDashboardservice) {}

ngOnInit(): void {
    this.getZoneList();
    this.GetAudio();
        const projectCodesStr = this.session._getSessionValue("projectCodes");
    if (!projectCodesStr) {
      console.error("⚠️ 'projectCodes' not found in session.");
      return;
    }

    const projectCodes = JSON.parse(projectCodesStr);
    const currentProject = "ATCS"; // change dynamically later if needed

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return;
    }

    const projectId = Number(project.value);
    this.projectId = projectId;
}


getZoneList() {
    this.service.GetAllZones().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
        const items = response?.result || [];

        const projectOptions = items.map((item: any) => ({
            text: (item.zoneName || '').trim() || 'Unknown',
            id: item.id
        }));

        projectOptions.unshift({
            text: 'All',
            id: 0
        });

        this.ZoneOptions = projectOptions;
        
    }, error => {
        console.error('Error fetching Zone list', error);
    });
}

GetAudio() {
  // Hardcoded response representing the API structure
  const hardcodedResponse = {
    "result": "{\"data\":[\"largeAudio\",\"Audio 5\",\"newfile\",\"new11\",\"new33\",\"malayalamAudio\",\"sss\",\"LiveAudio 1\",\"sebastian\",\"26sebastian\",\"35sebastian\",\"60sSebastian\",\"ssewee\",\"seerewee\"],\"status\":\"success\"}",
    "success": true
  };

  // Logic to process the hardcoded data
  if (hardcodedResponse?.result) {
    const parsed = JSON.parse(hardcodedResponse.result);
    const audioNames: string[] = parsed.data || [];

    // Filter and Map to the format needed for the dropdown
    this.audioSettings.options = audioNames
      .filter(name => name && name.trim().length > 0)
      .map(name => ({
        name: name.trim(),
        value: name.trim()
      }));

    this.isAudioLoaded = true;
    console.log("Hardcoded Dropdown Options Patched:", this.audioSettings.options);
  }
}
// GetAudio() {
//     debugger;
//        this._common._sessionAPITags().subscribe((res:any) => {
//           let _inputTag = res.find((x: any) => x.tag == "GetAudioFiles");
//           let requestBody = JSON.parse(_inputTag.inputRequest);
//           // let _inputRequest = JSON.parse(JSON.parse(_inputTag.inputRequest).bodyInputs);
//           // console.log(_inputRequest);
//           // let _input = _inputRequest[0];
//           // let _request: any[] = [];
//            this.service.SiteResponse(requestBody)
//                 .pipe(withLoader(this.loaderService))
//                 .subscribe({
//              next: (response: any) => {
//   if (response?.result) {
//     const parsed = JSON.parse(response.result);
//     const audioNames: string[] = parsed.data || [];

//     // Map and Filter out empty or whitespace-only names
//     this.audioSettings.options = audioNames
//       .filter(name => name && name.trim().length > 0) 
//       .map(name => ({
//         name: name.trim(),
//         value: name.trim()
//       }));

//     this.isAudioLoaded = true;
//   }
// },
//                   error: (error) => {
//                     console.error('Error fetching Audio Files:', error);
//                   }
//                 });
//         })
//    }

onZoneSelectionChange(event: any) {
    const selectedValues = event.value || [];
    const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

    if (!allOption) return;

    const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

    if (isAllSelected) {
        // If "All" is selected, select everything except "All" (or logic to keep "All" selected visually but semantics imply all items)
        // Adjusting logic to match ATCS: if "All" selected, usually specific behavior
        // Based on ATCS snippet:
        const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
        this.selectedZones = [...allExceptAll];
    } else {
        // If deselecting "All" or just picking items
         this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
    }
      this.selectedZoneIds = this.selectedZones.map(zone => zone.id);
  this.loadJunctions();
}

// Define a variable at the top of your class to store the string


loadJunctions(): void {
  // Pass the dynamic projectId in an array as required by the API
  this.service.GetActiveSitesbyZoneAndProject(this.selectedZoneIds, [3])
    .pipe(withLoader(this.loaderService))
    .subscribe((res: any) => {
      if (res && res.success && res.result) {
        
     
        this.commaSeparatedSiteNames = res.result
          .map((item: any) => item.siteName)
          .filter((name: string) => !!name) 
          .join(',');

        console.log("Comma Separated Sites:", this.commaSeparatedSiteNames);


      }
    });
}

clearZones() {
    this.selectedZones = [];
}

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFileName = input.files[0].name;
    // store file, upload etc
  } else {
    this.selectedFileName = '';
  }
}

}
