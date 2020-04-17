import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenAssessmentComponent } from './taken-assessment.component';

describe('TakenAssessmentComponent', () => {
  let component: TakenAssessmentComponent;
  let fixture: ComponentFixture<TakenAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakenAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakenAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
