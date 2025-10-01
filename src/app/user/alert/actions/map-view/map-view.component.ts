import { Component, TemplateRef } from '@angular/core';
import { CmLeafletComponent } from '../../../../common/cm-leaflet/cm-leaflet.component';
import { CommonModule, NgIfContext } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-view',
  imports: [CmLeafletComponent,CommonModule,FormsModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css',
  standalone : true
})
export class MapViewComponent {
siteList: any[] = [];
labelList: any[] = [
  { key: 'pt', label: 'Phase Time' },
  { key: 'sl', label: 'Saturation Level' }, 
  { key: 'm', label: 'Mode' },
  { key: 'it', label: 'Interval Time' },
  { key: 'pn', label: 'Plan Number' },
  { key: 'h', label: 'Health' },
  { key: 'ct', label: 'Cycle Time' },
  { key: 'serverTime', label: 'Server Time' },
  { key: 'id', label: 'Server Id' }
];
isMap : boolean =false;
popupData: { [siteId: string]: any } = {};
noFields: TemplateRef<NgIfContext<boolean>>|null;
}
