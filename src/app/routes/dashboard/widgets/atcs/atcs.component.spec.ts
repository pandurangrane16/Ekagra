import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtcsComponent } from './atcs.component';

describe('AtcsComponent', () => {
  let component: AtcsComponent;
  let fixture: ComponentFixture<AtcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtcsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
