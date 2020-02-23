import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShortAnswerComponent } from './edit-shortAnswer.component';

describe('EditShortAnswerComponent', () => {
  let component: EditShortAnswerComponent;
  let fixture: ComponentFixture<EditShortAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShortAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShortAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
