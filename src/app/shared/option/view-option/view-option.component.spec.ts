import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOptionComponent } from './view-option.component';

describe('ViewOptionComponent', () => {
  let component: ViewOptionComponent;
  let fixture: ComponentFixture<ViewOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
