import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveilienceCameraComponent } from './surveilience-camera.component';

describe('SurveilienceCameraComponent', () => {
  let component: SurveilienceCameraComponent;
  let fixture: ComponentFixture<SurveilienceCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveilienceCameraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveilienceCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
