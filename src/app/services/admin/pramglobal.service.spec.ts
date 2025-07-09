import { TestBed } from '@angular/core/testing';

import { PramglobalService } from './pramglobal.service';

describe('PramglobalService', () => {
  let service: PramglobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PramglobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
