import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrueFalseComponent } from './edit-true-false.component';

describe('EditTrueFalseComponent', () => {
  let component: EditTrueFalseComponent;
  let fixture: ComponentFixture<EditTrueFalseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTrueFalseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
