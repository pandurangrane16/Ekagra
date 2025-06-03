import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsHealthComponent } from './sensors-health.component';

describe('SensorsHealthComponent', () => {
  let component: SensorsHealthComponent;
  let fixture: ComponentFixture<SensorsHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorsHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
