import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class loginservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';


Login(_data: any) {
    return this._httpService._postMethod(_data, 'api/TokenAuth/Authenticate');
  }



}
