import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveiliencePageComponent } from './surveilience-page.component';

describe('SurveiliencePageComponent', () => {
  let component: SurveiliencePageComponent;
  let fixture: ComponentFixture<SurveiliencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveiliencePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveiliencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
