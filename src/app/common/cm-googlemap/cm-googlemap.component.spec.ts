import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmGooglemapComponent } from './cm-googlemap.component';

describe('CmGooglemapComponent', () => {
  let component: CmGooglemapComponent;
  let fixture: ComponentFixture<CmGooglemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmGooglemapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmGooglemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
