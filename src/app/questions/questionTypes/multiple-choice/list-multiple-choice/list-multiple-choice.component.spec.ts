import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMultipleChoiceComponent } from './list-multiple-choice.component';

describe('ListMultipleChoiceComponent', () => {
  let component: ListMultipleChoiceComponent;
  let fixture: ComponentFixture<ListMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
