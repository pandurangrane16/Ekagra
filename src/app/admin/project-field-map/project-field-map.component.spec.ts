import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFieldMapComponent } from './project-field-map.component';
import { AppCustomSelectComponent } from '../../common/custom-select/custom-select.component';

describe('ProjectFieldMapComponent', () => {
  let component: ProjectFieldMapComponent;
  let fixture: ComponentFixture<ProjectFieldMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFieldMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFieldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
