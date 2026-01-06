import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';


import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class vmsdashboardService {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectfieldCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectField/Create');
  }

  ProjectfieldEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/ProjectField/Update');
  }

    PostSiteResponse(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectAPI/SiteResponse');
  }
 GetVehicleCategoryWiseCount(SiteId: any, fromdate: any, todate: any) {
    return this._httpService._getMethod('api/services/app/NeatParkGraph/GetVehicleCategoryWiseCount?siteIds='+encodeURIComponent(SiteId)+'&fromDate='+fromdate+'&toDate='+todate);
  }



  GetVmsListDataByZone(zoneIds?: number[]): Observable<any> {
  const params: string[] = [];


  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach((id: number) => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  

  const url = `api/services/app/VMSGraph/GetVmsListDataByZone${queryString}`;

  return this._httpService._getMethod(url);
}

   GetSensorStatusSummary(fromdate: any, todate: any) {
    return this._httpService._getMethod('api/services/app/NeatParkGraph/GetSensorStatusSummary?fromDate='+fromdate+'&toDate='+todate);
  }
        GetAllZones() {
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListByUserId');
  } 

GetParkingOccupancySummaryPerLot(siteIds: string[], fromDate: string, toDate: string) {
  let queryParts: string[] = [];
  queryParts.push(`fromDate=${fromDate}`);
  queryParts.push(`toDate=${toDate}`);

  siteIds.forEach(id => {
    queryParts.push(`siteIds=${id}`);
  });

  // Join them with '&'
  const queryString = queryParts.join('&');

  // If your _getMethod handles the '?' internally, just pass the string
  return this._httpService._getMethod('api/services/app/NeatParkGraph/GetParkingOccupancySummaryPerLot?' + queryString);
}
   GetTotalCollectionAmount(SiteId: any, fromdate: any, todate: any) {
    return this._httpService._getMethod('api/services/app/NeatParkGraph/GetTotalCollectionAmount?siteIds='+encodeURIComponent(SiteId)+'&fromDate='+fromdate+'&toDate='+todate);
  }
 GetPenaltyDetails(SiteId: any, fromdate: any, todate: any) {
    return this._httpService._getMethod('api/services/app/NeatParkGraph/GetPenaltyDetails?siteIds='+encodeURIComponent(SiteId)+'&fromDate='+fromdate+'&toDate='+todate);
  }




GetAll(MaxResultCount: number, SkipCount: number,) {
    return this._httpService._getMethod('api/services/app/ProjectField/GetAllProjectFieldMasterPage?MaxResultCount='+MaxResultCount+'&SkipCount='+SkipCount);
  }
  Delete(id: number) {
    return this._httpService._deleteMethod('api/services/app/ProjectField/Delete?Id='+id);
  }

  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }


GetFilteredList(
  ProjectId?: number,
  filter?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }

  if (filter !== null && filter !== undefined && filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(filter)}`);
  }

  if (status !== null && status !== undefined) {
    params.push(`IsActive=${status}`);
  }

  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ProjectField/GetAllProjectFieldMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}

CheckMapLabel(
  projectId?: number,
  MapLabel?:any,
  id?:any
) {
  let params: string[] = [];

  if (projectId !== null && projectId !== undefined) {
    params.push(`projectId=${projectId}`);
  }



  if (MapLabel !== null && MapLabel !== undefined) {
    params.push(`MapLabel=${MapLabel}`);
  }


  if (id !== null && id !== undefined) {
    params.push(`id=${id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ProjectField/CheckProjectNameAndMapLabelExist${queryString}`;

  return this._httpService._postMethod(null,url);
}




}
