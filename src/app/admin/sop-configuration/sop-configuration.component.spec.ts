import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopConfigurationComponent } from './sop-configuration.component';

describe('SopConfigurationComponent', () => {
  let component: SopConfigurationComponent;
  let fixture: ComponentFixture<SopConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SopConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
