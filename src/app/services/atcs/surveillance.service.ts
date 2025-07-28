import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SurveillanceService {
  constructor(
    private _httpService: HttpService,  private http: HttpClient) { }
    GetSiteLocationCameraListForSurveillance(ProjectId: number) {
    return this._httpService._getMethod('api/services/app/Surveillance/GetSiteLocationCameraListForSurveillance?ProjectId='+ProjectId);
  }
}
