import { TestBed } from '@angular/core/testing';

import { TesDashboardService } from './tes-dashboard.service';

describe('TesDashboardService', () => {
  let service: TesDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TesDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
