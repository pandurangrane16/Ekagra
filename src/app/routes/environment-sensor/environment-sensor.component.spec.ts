import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentSensorComponent } from './environment-sensor.component';

describe('EnvironmentSensorComponent', () => {
  let component: EnvironmentSensorComponent;
  let fixture: ComponentFixture<EnvironmentSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentSensorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
