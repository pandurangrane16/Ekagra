import { TestBed } from '@angular/core/testing';

import { AlertlogService } from './alertlog.service';

describe('AlertlogService', () => {
  let service: AlertlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
