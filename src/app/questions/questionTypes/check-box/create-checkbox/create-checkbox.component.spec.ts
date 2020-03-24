import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCheckboxComponent } from './create-checkbox.component';

describe('CreateCheckboxComponent', () => {
  let component: CreateCheckboxComponent;
  let fixture: ComponentFixture<CreateCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
