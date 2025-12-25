import { Injectable,OnInit } from '@angular/core';
import { HttpService } from './common/http.service';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TesDashboardService {



  constructor(private _httpService: HttpService) { }

  GetSiteResponse(data: any) {
    return this._httpService._postMethod( data,'api/services/app/ProjectAPI/SiteResponse');
  }
}
