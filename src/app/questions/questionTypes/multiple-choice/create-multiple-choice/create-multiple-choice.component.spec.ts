import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMultipleChoiceComponent } from './create-multiple-choice.component';

describe('CreateMultipleChoiceComponent', () => {
  let component: CreateMultipleChoiceComponent;
  let fixture: ComponentFixture<CreateMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
