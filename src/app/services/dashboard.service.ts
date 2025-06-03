import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../models/dashboard';
import { SurveillanceComponent } from '../routes/dashboard/widgets/surveillance/surveillance.component';
import { IncidentsComponent } from '../routes/dashboard/widgets/incidents/incidents.component';
import { SopComponent } from '../routes/dashboard/widgets/sop/sop.component';
import { NotificationComponent } from '../routes/dashboard/widgets/notification/notification.component';
import { MapviewComponent } from '../routes/dashboard/widgets/mapview/mapview.component';
import { ParkingComponent } from '../routes/dashboard/widgets/parking/parking.component';
import { AtcsComponent } from '../routes/dashboard/widgets/atcs/atcs.component';
import { AirQualityComponent } from '../routes/dashboard/widgets/air-quality/air-quality.component';
import { NewAlertComponent } from '../routes/dashboard/widgets/new-alert/new-alert.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Surveillance',
      content: SurveillanceComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#98DDFF',
      color: 'black',
    },
    {
      id: 2,
      label: 'Pending vs Resolved Incidents',
      content: IncidentsComponent,
      rows: 1,
      cols: 2,
      color: 'black',
    },
    {
      id: 3,
      label: 'Map View',
      content: MapviewComponent,
      rows: 2,
      cols: 3,
      color: 'black',
    },
    {
      id: 4,
      label: 'Alerts & Notification',
      content: NotificationComponent,
      rows: 2,
      cols: 1,
      color: 'black',
    },
    {
      id: 5,
      label: 'Alert Action & SOP',
      content: SopComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#1C2D7B',
      color: 'white',
    },
    {
      id: 6,
      label: 'Parking',
      content: ParkingComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#85D685',
    },
    {
      id: 7,
      label: 'ATCS',
      content: AtcsComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#FFBB76',
    },
    {
      id: 8,
      label: 'Air Quality',
      content: AirQualityComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#009999',
    },
    {
      id: 9,
      label: 'New Alert!',
      content: NewAlertComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#1C2D7B',
      color: 'white',
    },
  ]);

  addedWidgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Surveillance',
      content: SurveillanceComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#98DDFF',
      color: 'black',
    },
    {
      id: 2,
      label: 'Pending vs Resolved Incidents',
      content: IncidentsComponent,
      rows: 1,
      cols: 2,
      color: 'black',
    },
    {
      id: 3,
      label: 'Map View',
      content: MapviewComponent,
      rows: 2,
      cols: 3,
      color: 'black',
    },
    {
      id: 4,
      label: 'Alerts & Notification',
      content: NotificationComponent,
      rows: 2,
      cols: 1,
      color: 'black',
    },
    {
      id: 5,
      label: 'Alert Action & SOP',
      content: SopComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#1C2D7B',
      color: 'white',
    },
    {
      id: 6,
      label: 'Parking',
      content: ParkingComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#85D685',
    },
    {
      id: 7,
      label: 'ATCS',
      content: AtcsComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#FFBB76',
    },
    {
      id: 8,
      label: 'Air Quality',
      content: AirQualityComponent,
      rows: 1,
      cols: 1,
      color: 'black',
      backgroundColor: '#009999',
    },
    {
      id: 9,
      label: 'New Alert!',
      content: NewAlertComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#1C2D7B',
      color: 'white',
    },
    
  ]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((w) => w.id);
    return this.widgets().filter((w) => !addedIds.includes(w.id));
  });
  fetchWidget() {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      const widgetAsString = localStorage.getItem('dashboardWidgets');

      if (widgetAsString) {
        const widgets = JSON.parse(widgetAsString) as Widget[];
        widgets.forEach((widget) => {
          const content = this.widgets().find(
            (w) => w.id === widget.id
          )?.content;
          if (content) {
            widget.content = content;
          }
        });
        this.addedWidgets.set(widgets);
      }
    }
  }

  addWidget(w: Widget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...w }]);
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === this.addedWidgets().length - 1) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];
    this.addedWidgets.set(newWidgets);
  }
  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === 0) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter((w) => w.id !== id));
  }

  constructor() {
    this.fetchWidget();
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(
      (w) => ({ ...w })
    );
    widgetsWithoutContent.forEach((w) => {
      delete w.content;
    });
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      localStorage.setItem(
        'dashboardWidgets',
        JSON.stringify(widgetsWithoutContent)
      );
    }
  });

  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
    const sourceIndex = this.addedWidgets().findIndex(
      (w) => w.id === sourceWidgetId
    );
    if(sourceIndex === -1){
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];
    const targetIndex = newWidgets.findIndex((w)=> w.id === targetWidgetId);
    if(targetIndex === -1){
      return;
    }

    const insertAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;
    newWidgets.splice(insertAt,0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }
}
