import { Component, inject, Input, OnInit } from '@angular/core';
import { SessionService } from '../../services/common/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-routes',
  imports: [],
  templateUrl: './dash-routes.component.html',
  styleUrl: './dash-routes.component.css'
})
export class DashRoutesComponent implements OnInit {
  sessionService = inject(SessionService);
  route = inject(Router);
  @Input() data: any;
  configData: any;
  ngOnInit(): void {
    let _data = this.sessionService._getSessionValue("config");
    console.log(JSON.parse(_data ?? ''));
    this.configData = _data;
    let code = this.configData.projectCodes.filter((x: any) => x.name == this.data.apilable)
    this.route.navigate([this.data.link + "/" + code.id])
  }

}
