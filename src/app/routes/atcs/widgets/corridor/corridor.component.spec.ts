import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridorComponent } from './corridor.component';

describe('CorridorComponent', () => {
  let component: CorridorComponent;
  let fixture: ComponentFixture<CorridorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorridorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorridorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
