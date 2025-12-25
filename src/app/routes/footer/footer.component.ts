import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SessionService } from '../../services/common/session.service';
import { loginservice } from '../../services/admin/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    encapsulation: ViewEncapsulation.None
})
export class FooterComponent {
    poweredLine : string = "";
    @Input() customClass = '';
    constructor(private http: HttpClient){
        this.http.get('assets/config/config.json').subscribe((res:any) => {
            this.poweredLine = res.FooterLine;
          });
    }
}
