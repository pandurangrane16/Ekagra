import { TestBed } from '@angular/core/testing';

import { RoleConfigurationService } from './role-configuration.service';

describe('RoleConfigurationService', () => {
  let service: RoleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
