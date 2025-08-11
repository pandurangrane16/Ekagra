import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'siteSearch',
   standalone: true
})
export class SiteSearchPipe implements PipeTransform {

 transform(sites: any[], searchText: string): any[] {
    if (!sites) return [];
    if (!searchText) return sites;

    searchText = searchText.toLowerCase();

    return sites.filter(site =>
      site.siteName.toLowerCase().includes(searchText)
    );
  }

}
