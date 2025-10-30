import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertlogService {

 constructor(
    private _httpService: HttpService) { }

  jsonurl: string = '/assets/config/config.json';

  
  GetAlerthistory(
    alertId?: number
  ) {
    let params: string[] = [];

    if (alertId !== null && alertId !== undefined) {
      params.push(`alertId=${alertId}`);
    }
    const queryString = params.length ? '?' + params.join('&') : '';
    const url = `api/services/app/AlertLog/GetAlerthistory${queryString}`;

    return this._httpService._getMethod(url);
  }

  AlertLogCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/AlertLog/Create');
  }
}
