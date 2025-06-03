import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MumbaiAirComponent } from './mumbai-air.component';

describe('MumbaiAirComponent', () => {
  let component: MumbaiAirComponent;
  let fixture: ComponentFixture<MumbaiAirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MumbaiAirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MumbaiAirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
