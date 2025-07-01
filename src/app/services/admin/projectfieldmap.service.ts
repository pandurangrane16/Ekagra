import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectfieldmapService {
// private apiUrl = 'https://172.19.32.210:8002/api/services/app/Project/GetAll';
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
  GetProjectFieldMapByProjectId() {
    return this._httpService._getMethod('api/services/app/ProjectFieldMap/GetProjectFieldMapByProjectId');
  }  
//   projectFielByProjectIdWithAllType(projectId: number, projecApitId: number) {
//   const url = `api/services/app/ProjectFieldMap/projectFielByProjectIdWithAllType?projectId=${projectId}&projecApitId=${projecApitId}`;
//   return this._httpService._getMethod(url);
// }

// projectFielByProjectIdWithAllType(projectId: number, projectAPIId: number) {
//   const url = 'https://172.19.32.210:8002/api/services/app/ProjectFieldMap/projectFielByProjectIdWithAllType';
//   const body = {
//     projectId: projectId,
//     projectAPIId: projectAPIId
//   };
//   return this._httpService._postMethod(url, body);

// }
// 
projectFieldByProjectIdWithAllType(projectId: number, projectAPIId: number) {
  const body = {
    projectId: projectId,
    projectAPIId: projectAPIId
  };

  return this._httpService._postMethod(body, 'api/services/app/ProjectFieldMap/ProjectFieldByProjectIdWithAllType');
}

  GetActiveProjectFieldMasterByProjectidForAllTypes(projectId: number): Observable<any> {
  const url = `api/services/app/ProjectField/GetActiveProjectFieldMasterByProjectidForAllTypes?Id=${projectId}`;
  return this._httpService._getMethod(url);
}

  GetActiveProjectFieldMasterByProjectidForAPI(projectApiId: number) {
    // return this._httpService._getMethod('api/services/app/ProjectFieldMap/GetActiveProjectFieldMasterByProjectidForAPI');
    const url = `api/services/app/ProjectFieldMap/GetActiveProjectFieldMasterByProjectidForAPI?Id=${projectApiId}`;
  return this._httpService._getMethod(url);
  }

}
