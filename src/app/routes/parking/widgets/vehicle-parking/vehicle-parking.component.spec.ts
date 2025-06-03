import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleParkingComponent } from './vehicle-parking.component';

describe('VehicleParkingComponent', () => {
  let component: VehicleParkingComponent;
  let fixture: ComponentFixture<VehicleParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleParkingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
