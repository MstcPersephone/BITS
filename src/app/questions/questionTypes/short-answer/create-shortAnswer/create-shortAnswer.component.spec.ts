import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShortAnswerComponent } from './create-shortAnswer.component';

describe('CreateShortAnswerComponent', () => {
  let component: CreateShortAnswerComponent;
  let fixture: ComponentFixture<CreateShortAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShortAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShortAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
