import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomSelectComponent } from './custom-select.component';

describe('AppCustomSelectComponent', () => {
  let component: AppCustomSelectComponent;
  let fixture: ComponentFixture<AppCustomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCustomSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCustomSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
