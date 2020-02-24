import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Createshort-answerComponent } from './create-short-answer.component';

describe('Createshort-answerComponent', () => {
  let component: Createshort-answerComponent;
  let fixture: ComponentFixture<Createshort-answerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Createshort-answerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Createshort-answerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
