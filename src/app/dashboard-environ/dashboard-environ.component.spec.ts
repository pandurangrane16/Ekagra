import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEnvironComponent } from './dashboard-environ.component';

describe('DashboardEnvironComponent', () => {
  let component: DashboardEnvironComponent;
  let fixture: ComponentFixture<DashboardEnvironComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEnvironComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEnvironComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
