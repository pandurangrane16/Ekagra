import { TestBed } from '@angular/core/testing';

import { ContactConfigService } from './contact-config.service';

describe('ContactConfigService', () => {
  let service: ContactConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
