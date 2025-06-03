import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPlacesComponent } from './parking-places.component';

describe('ParkingPlacesComponent', () => {
  let component: ParkingPlacesComponent;
  let fixture: ComponentFixture<ParkingPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
