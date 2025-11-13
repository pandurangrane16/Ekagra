import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActionMappingComponent } from './role-action-mapping.component';

describe('RoleActionMappingComponent', () => {
  let component: RoleActionMappingComponent;
  let fixture: ComponentFixture<RoleActionMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleActionMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleActionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
