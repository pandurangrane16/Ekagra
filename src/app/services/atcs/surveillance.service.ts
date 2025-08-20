import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveillanceService {
  constructor(
    private _httpService: HttpService, private http: HttpClient) { }
  GetSiteLocationCameraListForSurveillance(ProjectId: any) {
    // code to fetch hls_url URL from config.json file 
    debugger;
    //this.getConfigDetails();

    return this._httpService._getMethod('api/services/app/Surveillance/GetSiteLocationCameraListForSurveillance?ProjectId=' + ProjectId);


  }

  // code to fetch hls_url URL from config.json file
  _configDataBS$ = new BehaviorSubject<any[]>([]);
  _configData$ = this._configDataBS$.asObservable();
  public hls_url = '';
  getConfigDetails() {
    debugger;
    this.http.get("assets/config/config.json")
      .pipe(take(1))
      .subscribe((_config: any) => {
        this._configDataBS$.next(_config);
        this.hls_url = _config.hls_url; // ✅ Correct key
        console.log(this.hls_url + " <- hls_url loaded");
      });
  }



  getLiveStreamUrl(siteId: number, rtspUrl: string) {
    //  const url = 'https://10.100.43.108:7000/Start';
    debugger;
    const url = this.hls_url + "Start"; // ✅ Uses loaded config
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


  stopLiveStream(siteId: number) {
    debugger;
    //  const url = 'https://10.100.43.108:7000/Stop';
    const url = this.hls_url + "Stop"; // ✅ Uses loaded config
    const body = {
      siteid: siteId.toString()
    };
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    return this.http.post(url, body, { headers });
  }


}
