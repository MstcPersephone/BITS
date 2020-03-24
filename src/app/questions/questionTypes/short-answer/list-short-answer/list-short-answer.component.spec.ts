import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShortAnswerComponent } from './list-short-answer.component';

describe('ListShortAnswerComponent', () => {
  let component: ListShortAnswerComponent;
  let fixture: ComponentFixture<ListShortAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListShortAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShortAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
