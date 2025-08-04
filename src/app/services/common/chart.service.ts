import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private chartConfigKey = 'savedChart';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  saveChartConfig(config: any) {
    if (this.isBrowser) {
      localStorage.setItem(this.chartConfigKey, JSON.stringify(config));
    }
  }

  getChartConfig(): any {
    if (this.isBrowser) {
      const raw = localStorage.getItem(this.chartConfigKey);
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  }
}
