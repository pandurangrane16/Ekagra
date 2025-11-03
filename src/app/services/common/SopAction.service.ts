import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/http.service';
@Injectable({
  providedIn: 'root'
})
export class SopActionService {

 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';



  SiteResponse(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectAPI/SiteResponse');
  }

  
  ConsumeResponse(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectAPI/Consume');
  }


 
}
