import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMultipleChoiceComponent } from './view-multiple-choice.component';

describe('ViewMultipleChoiceComponent', () => {
  let component: ViewMultipleChoiceComponent;
  let fixture: ComponentFixture<ViewMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
