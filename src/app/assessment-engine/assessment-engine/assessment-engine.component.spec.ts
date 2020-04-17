import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentEngineComponent } from './assessment-engine.component';

describe('AssessmentEngineComponent', () => {
  let component: AssessmentEngineComponent;
  let fixture: ComponentFixture<AssessmentEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
