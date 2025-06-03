import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonalComponent } from './zonal.component';

describe('ZonalComponent', () => {
  let component: ZonalComponent;
  let fixture: ComponentFixture<ZonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
