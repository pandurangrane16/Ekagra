import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTESComponent } from './dashboard-tes.component';
import { beforeEach, describe, it } from 'node:test';

describe('DashboardTESComponent', () => {
  let component: DashboardTESComponent;
  let fixture: ComponentFixture<DashboardTESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTESComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
