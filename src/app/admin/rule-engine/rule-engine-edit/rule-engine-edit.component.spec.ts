import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleEngineEditComponent } from './rule-engine-edit.component';

describe('RuleEngineEditComponent', () => {
  let component: RuleEngineEditComponent;
  let fixture: ComponentFixture<RuleEngineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleEngineEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleEngineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
