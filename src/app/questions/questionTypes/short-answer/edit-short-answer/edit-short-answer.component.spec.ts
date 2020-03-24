import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editshort-answerComponent } from './edit-short-answer.component';

describe('Editshort-answerComponent', () => {
  let component: Editshort-answerComponent;
  let fixture: ComponentFixture<Editshort-answerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editshort-answerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editshort-answerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
