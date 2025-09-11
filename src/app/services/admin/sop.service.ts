import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class SOPService {
// private apiUrl = 'https://172.19.32.210:8002/api/services/app/Project/GetAll';
 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';


  GetPolicyList() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetPolicyMasterListUnmapped');
  }



}
