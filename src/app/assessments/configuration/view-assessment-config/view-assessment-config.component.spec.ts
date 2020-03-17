import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentConfigComponent } from './view-assessment-config.component';

describe('ViewAssessmentConfigComponent', () => {
  let component: ViewAssessmentConfigComponent;
  let fixture: ComponentFixture<ViewAssessmentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssessmentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssessmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
