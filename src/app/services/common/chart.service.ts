import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }
  private chartConfigKey = 'savedChart';

  saveChartConfig(config: any) {
    localStorage.setItem(this.chartConfigKey, JSON.stringify(config));
  }

  getChartConfig(): any {
    const raw = localStorage.getItem(this.chartConfigKey);
    return raw ? JSON.parse(raw) : null;
  }
}
