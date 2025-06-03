import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalViolationComponent } from './total-violation.component';

describe('TotalViolationComponent', () => {
  let component: TotalViolationComponent;
  let fixture: ComponentFixture<TotalViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalViolationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
