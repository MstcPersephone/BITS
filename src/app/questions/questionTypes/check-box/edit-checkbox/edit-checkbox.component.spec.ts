import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCheckboxComponent } from './edit-checkbox.component';

describe('EditCheckboxComponent', () => {
  let component: EditCheckboxComponent;
  let fixture: ComponentFixture<EditCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
