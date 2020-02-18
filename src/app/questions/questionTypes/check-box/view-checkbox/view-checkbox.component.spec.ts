import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCheckboxComponent } from './view-checkbox.component';

describe('ViewCheckboxComponent', () => {
  let component: ViewCheckboxComponent;
  let fixture: ComponentFixture<ViewCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
