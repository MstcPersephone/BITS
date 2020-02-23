import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShortAnswerComponent } from './view-shortAnswer.component';

describe('ViewShortAnswerComponent', () => {
  let component: ViewShortAnswerComponent;
  let fixture: ComponentFixture<ViewShortAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewShortAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShortAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
