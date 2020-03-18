import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssessmentConfigComponent } from './create-assessment-config.component';

describe('CreateAssessmentConfigComponent', () => {
  let component: CreateAssessmentConfigComponent;
  let fixture: ComponentFixture<CreateAssessmentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssessmentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssessmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
