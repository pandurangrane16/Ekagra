import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveilienceCameraComponent } from './surveilience-camera.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('SurveilienceCameraComponent', () => {
  let component: SurveilienceCameraComponent;
  let fixture: ComponentFixture<SurveilienceCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveilienceCameraComponent],
       schemas: [CUSTOM_ELEMENTS_SCHEMA] 
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
