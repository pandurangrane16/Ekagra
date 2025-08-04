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

  getLiveStreamUrl(siteId: number,rtspUrl :string) {
 const url = 'http://10.100.43.108:7000/Start';
  const body = {
    siteid: siteId.toString(),
    rtsp: rtspUrl
  };
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  return this.http.post(url, body, { headers });
}

}
