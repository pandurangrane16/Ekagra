import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashmodeComponent } from './flashmode.component';

describe('FlashmodeComponent', () => {
  let component: FlashmodeComponent;
  let fixture: ComponentFixture<FlashmodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashmodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
