import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewshort-answerComponent } from './view-short-answer.component';

describe('Viewshort-answerComponent', () => {
  let component: Viewshort-answerComponent;
  let fixture: ComponentFixture<Viewshort-answerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Viewshort-answerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Viewshort-answerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
