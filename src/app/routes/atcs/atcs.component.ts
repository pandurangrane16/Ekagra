
import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { NotificationComponent } from "../dashboard/widgets/notification/notification.component";
import { ZonalComponent } from "./widgets/zonal/zonal.component";
import { CorridorComponent } from "./widgets/corridor/corridor.component";
import { FailuresComponent } from "./widgets/failures/failures.component";
import { CycleComponent } from "./widgets/cycle/cycle.component";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';
import { CmLeafletComponent } from '../../common/cm-leaflet/cm-leaflet.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { SessionService } from '../../services/common/session.service';
import { SiteRequestModel } from '../../models/admin/siteresponse.model';

interface Junction {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-atcs',
  imports: [CmLeafletComponent, NotificationComponent, ZonalComponent, CorridorComponent, FailuresComponent, CycleComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatDatepickerModule],
  templateUrl: './atcs.component.html',
  styleUrl: './atcs.component.css',
  providers: [provideNativeDateAdapter()]
})
export class AtcsComponent {

  loaderService = inject(LoaderService)
  constructor(private service: atcsDashboardservice) { }
  selectedJunction: string = '';
  isMap: boolean = false;
  islabel: boolean = false;
  basepath: any;
  id: any;
  startDate: Date | null = null;
endDate: Date | null = null;



  junctions: Junction[] = [
    { value: 'Junction 1', viewValue: 'Junction 1' },
    { value: 'Junction 2', viewValue: 'Junction 2' },
    { value: 'Junction 3', viewValue: 'Junction 3' },
  ];

  isCardExpanded = false;
  siteList: any[] = [];
  labelList: any[] = [];
  popupData: { [siteId: string]: any } = {};
  session = inject(SessionService);





  ngOnInit(): void {

    this.id = this.session._getSessionValue("projectIdRoute");
    console.log("projectIdRoute",this.id)




    this.service.getKeysDataForConfig('basePath').pipe(withLoader(this.loaderService)).subscribe(basePath => {
      console.log('basePath:', basePath);
      this.basepath = basePath;

      this.loadJunctions();
      this.loadpoints();
      this.loadpopuplabels();

    });


  }
  onMarkerClicked2(siteId: string) {
    this.service.login().pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        const token = res?.token;
        if (!token) {
          console.error("Token missing in login response");
          return;
        }

        const headers = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        this.service.sitedata(siteId, headers).pipe(withLoader(this.loaderService)).subscribe({
          next: (siteRes) => {
            console.log("Fetched site data:", siteRes);


            this.popupData = {
              [siteId]: siteRes
            };
          },
          error: (err) => {
            console.error("Error fetching site data:", err);
          }
        });
      },
      error: (err) => {
        console.error("Login failed:", err);
      }
    });
  }

  onMarkerClicked(siteId: string) {
      const model: SiteRequestModel = {
  projectId: 1,
  type: 0,
  inputs: siteId,
  bodyInputs: null,
  seq: 43
}
  this.service.SiteResponse(model).pipe(withLoader(this.loaderService)).subscribe({
    next: (res: any) => {
      if (!res?.result) {
        console.error("No result found in site response");
        return;
      }

     
      let parsedResult;
      try {
        parsedResult = JSON.parse(res.result);
      } catch (e) {
        console.error("Failed to parse result JSON:", e);
        return;
      }

      console.log("Fetched site response:", parsedResult);

    
      this.popupData = {
        [siteId]: parsedResult
      };
    },
    error: (err) => {
      console.error("Error fetching site response:", err);
    }
  });
}





  getSelectedJunctionName(): string {
    const selected = this.junctions.find(j => j.value === this.selectedJunction);
    //console.log(selected ? selected.viewValue : 'No junction selected');
    return selected ? selected.viewValue : 'Select a junction';
  }




  loadpoints(): void {
    //const basePath = 'https://172.19.32.51:8089/UploadedFiles/Icons/';
    const basePath = this.basepath
    this.service.GetSiteMasterByProjectId(this.id).pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        const rawSites = res?.result || [];

        if (rawSites.length === 0) {
          this.siteList = [];
          return;
        }

        // ✅ Assume all sites use the same mapIcon (from first record)
        const mapIconName = rawSites[0].mapIcon;
        const iconUrl = basePath + mapIconName;

        this.siteList = rawSites.map((site: any) => ({
          ...site,
          mapIconUrl: iconUrl  // attach full icon URL to every site
        }));

        this.isMap = true; // map loads only after siteList is ready
        console.log('Site list with icon:', this.siteList);
      },
      error: (err) => {
        console.error('Error fetching site list:', err);
      }
    });
  }
  loadpopuplabels(): void {
    this.service.getlabels(this.id).pipe(withLoader(this.loaderService)).subscribe((res: any) => {
      if (res && res.result && Array.isArray(res.result.items)) {
        this.labelList = res.result.items;
        this.islabel = true
        console.log(this.labelList)
      } else {
        this.labelList = [];
      }
    });
  }

  loadJunctions(): void {
    this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((res: any) => {
      if (res?.result?.items) {
        this.junctions = res.result.items.map((item: any) => ({
          value: item.siteId.toString(),
          viewValue: `${item.siteName} (${item.siteId})`
        }));
      }
    });
  }


  onJunctionChange(event: MatSelectChange) {
    const junction = event.value;
    this.selectedJunction = event.value;

  }
  expand(): void {
    this.isCardExpanded = !this.isCardExpanded;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.classList.toggle('fullscreenDiv');
  }



  DateWiseFilter(evtData: any, category: string) {
    if (category == "start")
{
       this.startDate = evtData.value;
      console.log("Start Date : " + evtData.value);
}  
    else{
       this.endDate = evtData.value;
      console.log("End Date : " + evtData.value);
    }
  }
}
