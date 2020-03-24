import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrueFalseComponent } from './list-true-false.component';

describe('ListTrueFalseComponent', () => {
  let component: ListTrueFalseComponent;
  let fixture: ComponentFixture<ListTrueFalseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTrueFalseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
