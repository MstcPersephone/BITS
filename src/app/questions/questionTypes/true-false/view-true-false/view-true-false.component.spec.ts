import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrueFalseComponent } from './view-true-false.component';

describe('ViewTrueFalseComponent', () => {
  let component: ViewTrueFalseComponent;
  let fixture: ComponentFixture<ViewTrueFalseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTrueFalseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
