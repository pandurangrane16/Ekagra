import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/http.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectapiService {

 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

DeleteProjectFieldMap(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectFieldMap/Delete');
  }

GetAllProjectFieldMap() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/GetAll');
  }

ProjectFieldMapById() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/ProjectFieldMapById');
  }
  CreateProjectFieldMap() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/Create');
  }
UpdateProjectFieldMap() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/Update');
  }
GetAllProjectFieldMapPage() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/GetAllProjectFieldMapPage');
  }
InsertUpdateBulkProjectFieldQuery() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/InsertUpdateBulkProjectFieldQuery');
  }
 
}
