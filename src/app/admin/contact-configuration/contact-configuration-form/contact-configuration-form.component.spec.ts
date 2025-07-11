import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactConfigurationFormComponent } from './contact-configuration-form.component';

describe('ContactConfigurationFormComponent', () => {
  let component: ContactConfigurationFormComponent;
  let fixture: ComponentFixture<ContactConfigurationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactConfigurationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
