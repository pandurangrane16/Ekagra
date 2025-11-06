import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVMSComponent } from './dashboard-vms.component';

describe('DashboardVMSComponent', () => {
  let component: DashboardVMSComponent;
  let fixture: ComponentFixture<DashboardVMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVMSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
