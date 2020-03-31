import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessmentConfigComponent } from './edit-assessment-config.component';

describe('EditAssessmentConfigComponent', () => {
  let component: EditAssessmentConfigComponent;
  let fixture: ComponentFixture<EditAssessmentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssessmentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssessmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
