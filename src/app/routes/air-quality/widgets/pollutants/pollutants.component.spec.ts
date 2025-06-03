import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutantsComponent } from './pollutants.component';

describe('PollutantsComponent', () => {
  let component: PollutantsComponent;
  let fixture: ComponentFixture<PollutantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PollutantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
